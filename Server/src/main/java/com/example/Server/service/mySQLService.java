package com.example.Server.service;

import org.springframework.stereotype.Service;

import com.example.Server.model.AddLiquidity;
import com.example.Server.model.RepoOtp;
import com.example.Server.model.Token;
import com.example.Server.model.User;
import com.example.Server.repository.mySQLRepo;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class mySQLService {

    @Autowired
    private mySQLRepo mySQLRepo;

    @Autowired
    private EmailService emailService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void generateAndSaveOTP(String email) {

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        LocalDateTime otpExpiry = LocalDateTime.now(ZoneOffset.UTC).plusMinutes(5);

        mySQLRepo.deleteExpiredOtp();
        mySQLRepo.upsertUserOTP(email, otp, otpExpiry);

        emailService.sendOtpEmail(email, otp);
    }

    public boolean verifyOTP(String email, String otp) {
        RepoOtp repoOtp = mySQLRepo.getOtpByEmail(email);
    
        if (repoOtp == null) {
            return false;
        }
    
        return otp.equals(repoOtp.getOtp()) && LocalDateTime.now(ZoneOffset.UTC).isBefore(repoOtp.getOtpExpiry());
    }    

    public User register(User user) {

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        
        return mySQLRepo.upsertUser(user);
    }

    public Optional<User> findByEmail(String email) {
        return mySQLRepo.findUserEmail(email);
    }

    public void saveToken(Token token) {
        mySQLRepo.insertToken(token);
    }
    
    public List<Token> getTokensByEmail(String email) {
        return mySQLRepo.findTokensByEmail(email);
    }
    
    public void saveAddLiquidity(AddLiquidity addLiquidity) {
        mySQLRepo.insertAddLiquidity(addLiquidity);
    }

    public List<AddLiquidity> getLiquidityByEmail(String email) {
        return mySQLRepo.findLiquidityByEmail(email);
    }
}
