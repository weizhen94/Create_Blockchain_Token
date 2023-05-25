import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Web3 from 'web3';

import MyContractABI from './MyContractABI.json';
import MyContractBytecode from './MyContractBytecode.json';

declare global {
  interface Window { ethereum: any; web3: any; }
}

@Component({
  selector: 'app-tokencreation',
  templateUrl: './tokencreation.component.html',
  styleUrls: ['./tokencreation.component.css']
})
export class TokencreationComponent implements OnInit{

  web3: any;
  createTokenForm!: FormGroup;
  contractAddress!: string;
  transactionHash!: string;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) { }

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
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    // Initialize form
    this.createTokenForm = this.formBuilder.group({
      tokenName: this.formBuilder.control<string>('', [ Validators.required ]),
      tokenSymbol: this.formBuilder.control<string>('', [ Validators.required ]),
      totalSupply: this.formBuilder.control<string>('', [ Validators.required ]),
    });
  }


  async submit() {
    if (this.createTokenForm.invalid) {
      return;
    }

    // Get the current user's account
    const accounts = await this.web3.eth.getAccounts();
    const account = accounts[0];

  // ABI and bytecode of your contract
  const abi = MyContractABI;
  const bytecode = MyContractBytecode.object;


    // Parameters
    const tokenName = this.createTokenForm.value.tokenName;
    const tokenSymbol = this.createTokenForm.value.tokenSymbol;
    const totalSupply = this.createTokenForm.value.totalSupply;

    // Deploy the contract
    const contract = new this.web3.eth.Contract(abi);
    contract.deploy({
      data: bytecode,
      arguments: [tokenName, tokenSymbol, totalSupply]
    }).send({
      from: account,
      gas: '4700000'
    }).on('receipt', (receipt: any) => {
      // Contract was successfully deployed, now we can send the transaction data to our backend
      this.contractAddress = receipt.contractAddress;
      this.transactionHash = receipt.transactionHash;
      this.httpClient.post('http://localhost:8080/api/transaction', { // Replace with your actual API endpoint
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        totalSupply: totalSupply,
        transactionHash: this.transactionHash,
        contractAddress: this.contractAddress
      }).subscribe(response => {
        console.log(response);
      });
    });
  }

}
