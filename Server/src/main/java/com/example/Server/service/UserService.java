package com.example.Server.service;

import org.springframework.stereotype.Service;

import com.example.Server.model.User;
import com.example.Server.repository.UserRepo;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EmailService emailService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void generateAndSaveOTP(String email) {

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        LocalDateTime otpExpiry = LocalDateTime.now(ZoneOffset.UTC).plusMinutes(10);

        userRepo.deleteExpiredOtp();
        userRepo.upsertUserOTP(email, otp, otpExpiry);

        emailService.sendOtpEmail(email, otp);
    }

    public User register(User user) {

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        
        return userRepo.insertUser(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findUserEmail(email);
    }
}
