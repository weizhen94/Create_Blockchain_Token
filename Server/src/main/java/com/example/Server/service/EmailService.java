package com.example.Server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.Server.model.TokenCaching;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    public void sendEmail(TokenCaching tokenCaching) {
    
    try {
        System.out.println("Sending email...");

        String subject = "Token Creation Success";
        String text = "Congratulations, your token has been successfully created. Here are the transaction details:\n\n" +
            "Transaction Hash: " + tokenCaching.getTransactionHash() + "\n" +
            "Contract Address: " + tokenCaching.getContractAddress() + "\n" +
            "Network: " + tokenCaching.getNetwork() + "\n" +
            "Token Name: " + tokenCaching.getTokenName() + "\n" +
            "Token Symbol: " + tokenCaching.getTokenSymbol() + "\n" +
            "Total Supply: " + tokenCaching.getTotalSupply();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("tokenforge257@gmail.com");
        message.setTo(tokenCaching.getUserEmail());
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
        System.out.println("Email sent!");
        } catch (MailException e) {
        System.out.println("Error while sending email: " + e.getMessage());
        }

    }
    
}
