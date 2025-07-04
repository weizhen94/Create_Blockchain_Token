import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Web3 from 'web3';

import TokenContractABI from './TokenContractABI.json';
import TokenContractBytecode from './TokenContractBytecode.json';
import { TokenService } from '../services/token.service';
import { TokenCaching } from '../models/token-caching';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

declare global {
  interface Window { ethereum: any; web3: any; }
}

@Component({
  selector: 'app-tokencreation',
  templateUrl: './tokencreation.component.html',
  styleUrls: ['./tokencreation.component.css']
})
export class TokencreationComponent implements OnInit, OnDestroy {

  web3: any;
  createTokenForm!: FormGroup;
  contractAddress!: string;
  transactionHash!: string;
  userEmail!: string;
  userEmailSubscription!: Subscription;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private tokenService: TokenService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    // Initialize web3
    if (window.ethereum) {
      try {
        // Request account access
        window.ethereum.request({ method: 'eth_requestAccounts' });
        this.web3 = new Web3(window.ethereum);
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      // Use MetaMask's provider
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    this.userEmailSubscription = this.userService.getUserEmail().subscribe(email => {
      this.userEmail = email;
    });

    this.createTokenForm = this.formBuilder.group({
      network: this.formBuilder.control<string>('Sepolia Testnet', [Validators.required]),
      tokenName: this.formBuilder.control<string>('', [Validators.required]),
      tokenSymbol: this.formBuilder.control<string>('', [Validators.required]),
      totalSupply: this.formBuilder.control<string>('', [Validators.required]),
    });
  }

  ngOnDestroy() {
    if (this.userEmailSubscription) {
      this.userEmailSubscription.unsubscribe();
    }
  }

  async submit() {
    if (this.createTokenForm.invalid) {
      return;
    }

    console.log("Creating token...");

    this.isLoading = true;

    // Get the network
    const network = this.createTokenForm.value.network;

    // Switch network
    await this.switchNetwork(network);

    // Get the current user's account
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];

    // ABI and bytecode of contract
    const abi = TokenContractABI;
    const bytecode = TokenContractBytecode.object;

    // Parameters
    const tokenName = this.createTokenForm.value.tokenName;
    const tokenSymbol = this.createTokenForm.value.tokenSymbol;
    // Converts the token supply to wei
    let totalSupplyInWei = this.createTokenForm.value.totalSupply.toString();
    totalSupplyInWei = this.web3.utils.toWei(totalSupplyInWei, 'ether');

    // Deploy the contract
    const contract = new this.web3.eth.Contract(abi);
    contract.deploy({
      data: bytecode,
      arguments: [tokenName, tokenSymbol, totalSupplyInWei]
    }).send({
      from: account,
      gas: '4700000'
    }).on('receipt', (receipt: any) => {
      this.contractAddress = receipt.contractAddress;
      this.transactionHash = receipt.transactionHash;

    const txHash = this.transactionHash; 

    this.tokenService.getTransactionStatus({txHash}).subscribe(response => {
      console.log(response);
    });
      
    // Converts the token supply from wei to ether
    const totalSupplyInEthers = this.web3.utils.fromWei(totalSupplyInWei, 'ether');
    
    const decimals = "18"; 
    
    const tokenCaching: TokenCaching = {
        transactionHash: this.transactionHash,
        network: network,
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        totalSupply: totalSupplyInEthers,
        decimals: decimals, 
        userAddress: account,
        contractAddress: this.contractAddress,
        timestamp: new Date().toISOString(),
        userEmail: this.userEmail,
      }
    
      console.log("Caching token...");
      this.tokenService.addTokenCaching(tokenCaching).subscribe(response => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/account']);
      });
    })
      .on('error', (error: Error) => {
        console.error('Error while creating token:', error);
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
