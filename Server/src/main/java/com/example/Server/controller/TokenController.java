package com.example.Server.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Server.model.OtpModel;
import com.example.Server.model.TokenCaching;
import com.example.Server.model.User;
import com.example.Server.service.EmailService;
import com.example.Server.service.TokenCachingService;
import com.example.Server.service.UserService;

@RestController
@RequestMapping("/api")
public class TokenController {

    @Autowired
    private TokenCachingService tokenCachingService; 

    @Autowired
    private EmailService emailService; 

    @Autowired
    private UserService userService; 

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody User user) {

        userService.generateAndSaveOTP(user.getEmail());

        return ResponseEntity.ok().body("{\"message\":\"OTP sent to email\"}");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpModel otpmodel) {
        boolean isVerified = userService.verifyOTP(otpmodel.getEmail(), otpmodel.getOtp());
        if (isVerified) {
            return ResponseEntity.ok().body("{\"message\":\"OTP verified\", \"verified\": true}");
        } else {
            return ResponseEntity.badRequest().body("{\"message\":\"Invalid or expired OTP\", \"verified\": false}");
        }
    }    

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        
        return ResponseEntity.ok(userService.register(user));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        
        Optional<User> foundUser = userService.findByEmail(user.getEmail());
        
        if (foundUser.isPresent() && passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
            return ResponseEntity.ok().body("{\"message\":\"Login successful\"}");
        } else {
            return ResponseEntity.badRequest().body("{\"message\":\"Invalid email or password\"}");
        }
    }

    @PostMapping("/checkUserExists")
    public ResponseEntity<?> checkUserExists(@RequestBody User user) {

        Optional<User> foundUser = userService.findByEmail(user.getEmail());

        if (foundUser.isPresent()) {
            return ResponseEntity.ok().body("{\"message\":\"Email exists!\", \"exists\": true}");
        } else {
            return ResponseEntity.ok().body("{\"message\":\"Email does not exists!\", \"exists\": false}");
        }
    }    

    @PostMapping("/transaction")
    public TokenCaching saveTokenTransaction(@RequestBody TokenCaching tokenCaching) {

        emailService.sendEmail(tokenCaching);

        return tokenCachingService.cacheTokenCreation(tokenCaching);
    }

}
