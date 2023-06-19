import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Web3 from 'web3';

import TokenContractABI from './TokenContractABI.json';
import AMMContractABI from './AMMContractABI.json';

@Component({
  selector: 'app-addliquidity',
  templateUrl: './addliquidity.component.html',
  styleUrls: ['./addliquidity.component.css']
})
export class AddliquidityComponent implements OnInit {

  web3: any;
  addLiquidityForm!: FormGroup;
  transactionHash!: string;
  contractAddress!: string;

  constructor(private formBuilder: FormBuilder) { }

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

    this.addLiquidityForm = this.formBuilder.group({
      network: this.formBuilder.control<string>('Sepolia Testnet', [Validators.required]),
      tokenA: this.formBuilder.control<string>('', [Validators.required]),
      tokenB: this.formBuilder.control<string>('', [Validators.required]),
      amountA: this.formBuilder.control<string>('', [Validators.required]),
      amountB: this.formBuilder.control<string>('', [Validators.required]),
    });
  }

  async submit() {
    if (this.addLiquidityForm.invalid) {
      return;
    }
  
    // Get the network
    const network = this.addLiquidityForm.value.network;
  
    // Switch network
    await this.switchNetwork(network);
  
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];
  
    const abi = AMMContractABI;
    const contractAddress = '0x60592aba12cD6af0Fa1f4c4733367BE501c24A7f';
  
    const tokenA = this.addLiquidityForm.value.tokenA;
    const tokenB = this.addLiquidityForm.value.tokenB;

    let amountAInWei = this.addLiquidityForm.value.amountA.toString();
    amountAInWei = this.web3.utils.toWei(amountAInWei, 'ether');
    console.log("Amount A In wei:", amountAInWei);

    let amountBInWei = this.addLiquidityForm.value.amountB.toString();
    amountBInWei = this.web3.utils.toWei(amountBInWei, 'ether');
    console.log("Amount A In wei:", amountBInWei);
  
    // Interact with the tokens
    const tokenAContract = new this.web3.eth.Contract(TokenContractABI, tokenA);
    const tokenBContract = new this.web3.eth.Contract(TokenContractABI, tokenB);
    
    // Approve the contract to spend the tokens
    await tokenAContract.methods.approve(contractAddress, amountAInWei).send({ from: account });
    console.log("Approved amount A!");
    await tokenBContract.methods.approve(contractAddress, amountBInWei).send({ from: account });
    console.log("Approved amount B!");

    // Interact with the contract
    console.log("Approving add liquidity...");
    const contract = new this.web3.eth.Contract(abi, contractAddress);
  
    contract.methods.addLiquidity(tokenA, tokenB, amountAInWei, amountBInWei).send({
      from: account,
      gas: '4700000'
    }).on('receipt', (receipt: any) => {
      this.transactionHash = receipt.transactionHash; 
      console.log(receipt); 
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

