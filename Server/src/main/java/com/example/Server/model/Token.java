package com.example.Server.model;

import java.util.Date;

public class Token {

    private String transactionHash;
    private String network;
    private String tokenName;
    private String tokenSymbol;
    private String totalSupply;
    private String decimals; 
    private String userAddress;
    private String contractAddress;
    private Date timestamp;
    private String userEmail; 
    
    public String getDecimals() {
        return decimals;
    }
    public void setDecimals(String decimals) {
        this.decimals = decimals;
    }
    public String getUserEmail() {
        return userEmail;
    }
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
    public String getNetwork() {
        return network;
    }
    public void setNetwork(String network) {
        this.network = network;
    }
    public String getTokenName() {
        return tokenName;
    }
    public void setTokenName(String tokenName) {
        this.tokenName = tokenName;
    }
    public String getTokenSymbol() {
        return tokenSymbol;
    }
    public void setTokenSymbol(String tokenSymbol) {
        this.tokenSymbol = tokenSymbol;
    }
    public String getTotalSupply() {
        return totalSupply;
    }
    public void setTotalSupply(String totalSupply) {
        this.totalSupply = totalSupply;
    }
    public String getUserAddress() {
        return userAddress;
    }
    public void setUserAddress(String userAddress) {
        this.userAddress = userAddress;
    }
    public String getTransactionHash() {
        return transactionHash;
    }
    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }
    public String getContractAddress() {
        return contractAddress;
    }
    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
    }
    public Date getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
    
}
