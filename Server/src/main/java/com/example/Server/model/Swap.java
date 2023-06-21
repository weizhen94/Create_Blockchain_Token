package com.example.Server.model;

public class Swap {

    private String tokenIn;
    private String amountIn;
    private String tokenOut;
    private String transactionHash;
    private String userEmail;

    public String getTokenIn() {
        return tokenIn;
    }
    public void setTokenIn(String tokenIn) {
        this.tokenIn = tokenIn;
    }
    public String getAmountIn() {
        return amountIn;
    }
    public void setAmountIn(String amountIn) {
        this.amountIn = amountIn;
    }
    public String getTokenOut() {
        return tokenOut;
    }
    public void setTokenOut(String tokenOut) {
        this.tokenOut = tokenOut;
    }
    public String getTransactionHash() {
        return transactionHash;
    }
    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }
    public String getUserEmail() {
        return userEmail;
    }
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
    
}
