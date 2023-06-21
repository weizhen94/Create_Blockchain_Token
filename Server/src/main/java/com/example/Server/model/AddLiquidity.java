package com.example.Server.model;

public class AddLiquidity {

    private String token;
    private String liquidityPair;
    private String amountToken;
    private String amountLiquidityPair;
    private String transactionHash;
    private String userEmail;

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getLiquidityPair() {
        return liquidityPair;
    }
    public void setLiquidityPair(String liquidityPair) {
        this.liquidityPair = liquidityPair;
    }
    public String getAmountToken() {
        return amountToken;
    }
    public void setAmountToken(String amountToken) {
        this.amountToken = amountToken;
    }
    public String getAmountLiquidityPair() {
        return amountLiquidityPair;
    }
    public void setAmountLiquidityPair(String amountLiquidityPair) {
        this.amountLiquidityPair = amountLiquidityPair;
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
