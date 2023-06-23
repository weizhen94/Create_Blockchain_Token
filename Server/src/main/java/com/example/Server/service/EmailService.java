package com.example.Server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.Server.model.AddLiquidity;
import com.example.Server.model.Swap;
import com.example.Server.model.Token;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String email, String otp) {
        try {
        String subject = "Your OTP Request";
        String text = "Hello, you have requested for an OTP from Token Forge.\n\n" +
            "Your OTP is: " + otp + "\n" +
            "\n" +
            "Head back to Token Forge and copy this code into the confirmation box. This code will be valid for 5 minutes.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("tokenforge257@gmail.com");
        message.setTo(email);
        message.setSubject(subject);
        message.setText(text);

            mailSender.send(message);
        } catch (MailException e) {
            System.out.println("Error while sending email: " + e.getMessage());
        }
    }
    
    public void sendTokenEmail(Token tokenCaching) {
    
    try {
        String subject = "Token Creation Success";
        String text = "Congratulations, your token has been successfully created. Here are the transaction details:\n\n" +
            "Transaction Hash: " + tokenCaching.getTransactionHash() + "\n" +
            "Contract Address: " + tokenCaching.getContractAddress() + "\n" +
            "Network: " + tokenCaching.getNetwork() + "\n" +
            "Token Name: " + tokenCaching.getTokenName() + "\n" +
            "Token Symbol: " + tokenCaching.getTokenSymbol() + "\n" +
            "Token Decimal: 18 " + "\n" +
            "Total Supply: " + tokenCaching.getTotalSupply();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("tokenforge257@gmail.com");
        message.setTo(tokenCaching.getUserEmail());
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
        } catch (MailException e) {
        System.out.println("Error while sending email: " + e.getMessage());
        }

    }
    
    public void sendAddLiquidityEmail(AddLiquidity addLiquidity) {

    try {
        String subject = "Liquidity Successfully Added";
        String text = "Congratulations, your liquidity pool has been successfully created. Here are the transaction details:\n\n" +
            "Transaction Hash: " + addLiquidity.getTransactionHash() + "\n" +
            "Network: Sepolia Testnet" + "\n" +
            "Your Token: " + addLiquidity.getToken() + "\n" +
            "Your Token Amount: " + addLiquidity.getAmountToken() + "\n" +
            "Liquidity Pair: " + addLiquidity.getLiquidityPair() + "\n" +
            "Liquidity Pair Amount: " + addLiquidity.getAmountLiquidityPair(); 

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("tokenforge257@gmail.com");
        message.setTo(addLiquidity.getUserEmail());
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
        } catch (MailException e) {
        System.out.println("Error while sending email: " + e.getMessage());
        }
    }

    public void sendSwapEmail(Swap swap) {

        try {
            String subject = "Swap Successful";
            String text = "Congratulations, your Swap has been successfully processed. Here are the transaction details:\n\n" +
                "Transaction Hash: " + swap.getTransactionHash() + "\n" +
                "Network: Sepolia Testnet" + "\n" +
                "Token In: " + swap.getTokenIn() + "\n" +
                "Amount In: " + swap.getAmountIn() + "\n" +
                "Token Out: " + swap.getTokenOut();
    
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("tokenforge257@gmail.com");
            message.setTo(swap.getUserEmail());
            message.setSubject(subject);
            message.setText(text);
    
            mailSender.send(message);
            } catch (MailException e) {
            System.out.println("Error while sending email: " + e.getMessage());
            }
        }
}
