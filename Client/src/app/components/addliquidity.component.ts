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
      network: this.formBuilder.control<string>('', [Validators.required]),
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
    const contractAddress = '0xbd8e3D4FF049A0232D6C911928EA8544A797d0bd';
  
    const tokenA = this.addLiquidityForm.value.tokenA;
    const tokenB = this.addLiquidityForm.value.tokenB;
    const amountA = this.addLiquidityForm.value.amountA;
    const amountB = this.addLiquidityForm.value.amountB;
  
    // Interact with the tokens
    const tokenAContract = new this.web3.eth.Contract(TokenContractABI, tokenA);
    const tokenBContract = new this.web3.eth.Contract(TokenContractABI, tokenB);
  
    // Approve the contract to spend the tokens
    await tokenAContract.methods.approve(contractAddress, amountA).send({ from: account });
    await tokenBContract.methods.approve(contractAddress, amountB).send({ from: account });
  
    // Interact with the contract
    const contract = new this.web3.eth.Contract(abi, contractAddress);
  
    contract.methods.addLiquidity(tokenA, tokenB, amountA, amountB).send({
      from: account,
      gas: '4700000'
    }).on('receipt', (receipt: any) => {
      this.transactionHash = receipt.transactionHash; 
      console.log(receipt); 
      console.log(this.transactionHash); 
    });
  }
  
  // switch network
  async switchNetwork(network: string) {
    try {
      switch (network) {
        case 'ethereum':
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }], // This is the chain ID for Ethereum Mainnet
          });
          break;
        case 'bsc':
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }], // This is the chain ID for Binance Smart Chain
          });
          break;
        case 'polygon':
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }], // This is the chain ID for Polygon (Matic)
          });
          break;
          case 'sepolia':
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
