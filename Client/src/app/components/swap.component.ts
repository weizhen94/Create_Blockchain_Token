import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Web3 from 'web3';

import TokenContractABI from './TokenContractABI.json';
import AMMContractABI from './AMMContractABI.json';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Swap } from '../models/swap';

declare global {
  interface Window { ethereum: any; web3: any; }
}

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.css']
})
export class SwapComponent implements OnInit, OnDestroy{

  web3: any;
  swapForm!: FormGroup;
  transactionHash!: string;
  contractAddress!: string;
  userEmail!: string;
  userEmailSubscription!: Subscription;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private tokenService: TokenService, private router: Router) { }

  ngOnInit() {
    if (window.ethereum) {
      try {
        window.ethereum.request({ method: 'eth_requestAccounts' });
        this.web3 = new Web3(window.ethereum);
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    this.userEmailSubscription = this.userService.getUserEmail().subscribe(email => {
      this.userEmail = email;
    });

    this.swapForm = this.formBuilder.group({
      network: this.formBuilder.control<string>('Sepolia Testnet', [Validators.required]),
      tokenIn: this.formBuilder.control<string>('', [Validators.required]),
      tokenOut: this.formBuilder.control<string>('', [Validators.required]),
      amountIn: this.formBuilder.control<string>('', [Validators.required]),
      slippage: this.formBuilder.control<number>(0, [Validators.required, Validators.pattern("^[0-9]*$")]),
    });
  }

  ngOnDestroy() {
    if (this.userEmailSubscription) {
      this.userEmailSubscription.unsubscribe();
    }
  }

  async submit() {
    if (this.swapForm.invalid) {
      return;
    }

    this.isLoading = true;
  
    // Get the network
    const network = this.swapForm.value.network;
  
    // Switch network
    await this.switchNetwork(network);
  
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];
  
    const abi = AMMContractABI;
    const contractAddress = '0x60592aba12cD6af0Fa1f4c4733367BE501c24A7f';
  
    const tokenIn = this.swapForm.value.tokenIn;
    const tokenOut = this.swapForm.value.tokenOut;

    let amountInInWei = this.swapForm.value.amountIn.toString();
    amountInInWei = this.web3.utils.toWei(amountInInWei, 'ether');
    console.log("Amount In (wei):", amountInInWei);

    const slippage = this.swapForm.value.slippage;

    // Interact with the tokens
    const checksummedTokenIn = this.web3.utils.toChecksumAddress(tokenIn);
    const tokenAContract = new this.web3.eth.Contract(TokenContractABI, checksummedTokenIn);

    // Approve the contract to spend the tokens
    await tokenAContract.methods.approve(contractAddress, amountInInWei).send({ from: account });
    console.log("Approved amount In!");
  
    // Interact with the contract
    console.log("Approving swap...");
    const contract = new this.web3.eth.Contract(abi, contractAddress);
  
    contract.methods.swap(tokenIn, tokenOut, amountInInWei, slippage).send({
      from: account,
      gas: '4700000'
    }).on('receipt', (receipt: any) => {
      this.transactionHash = receipt.transactionHash; 
      console.log(receipt); 
    
    const swap: Swap = {
        tokenIn: tokenIn,
        amountIn: this.swapForm.value.amountIn,
        tokenOut: tokenOut,
        transactionHash: this.transactionHash,
        userEmail: this.userEmail,
      }
      
    console.log("Caching swap...");
          this.tokenService.addSwapCaching(swap).subscribe(response => {
            console.log(response);
            this.isLoading = false;
            this.router.navigate(['/account']);
          });
      })
      .on('error', (error: Error) => {
        console.error('Error while swapping:', error);
    });
  }

  // switch network
  async switchNetwork(network: string) {
    try {
      switch (network) {
          case 'Sepolia Testnet':
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xAA36A7' }], // This is the chain ID for Sepolia
            });
            break;
          default:
            throw new Error('Unsupported network');
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
  }

}
