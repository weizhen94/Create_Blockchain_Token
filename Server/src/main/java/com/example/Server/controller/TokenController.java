package com.example.Server.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Server.jwt.JwtUtil;
import com.example.Server.model.AuthenticationResponse;
import com.example.Server.model.EtherscanRequest;
import com.example.Server.model.OtpModel;
import com.example.Server.model.Token;
import com.example.Server.model.User;
import com.example.Server.service.EmailService;
import com.example.Server.service.EtherscanService;
import com.example.Server.service.JwtUserDetailsService;
import com.example.Server.service.mongoDBService;
import com.example.Server.service.mySQLService;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api")
public class TokenController {

    @Autowired
    private mongoDBService mongoDBService; 

    @Autowired
    private EmailService emailService; 

    @Autowired
    private mySQLService mySQLService; 

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Autowired
    private EtherscanService etherscanService;

    @Autowired
    private JwtUtil jwtTokenUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody User user) {

        mySQLService.generateAndSaveOTP(user.getEmail());

        return ResponseEntity.ok().body("{\"message\":\"OTP sent to email\"}");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpModel otpmodel) {
        boolean isVerified = mySQLService.verifyOTP(otpmodel.getEmail(), otpmodel.getOtp());
        if (isVerified) {
            return ResponseEntity.ok().body("{\"message\":\"OTP verified\", \"verified\": true}");
        } else {
            return ResponseEntity.ok().body("{\"message\":\"Invalid or expired OTP\", \"verified\": false}");
        }
    }    

    /*

    To test in AdvancedRestClient:
    http://localhost:8080/api/login

    {
    "email": "weizhen94@gmail.com",
    "password": "Password11!"
    }

    */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

    Optional<User> foundUser = mySQLService.findByEmail(user.getEmail());

    if (foundUser.isPresent() && passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
        
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        final String jwt = jwtTokenUtil.generateToken(userDetails);
        
        return ResponseEntity.ok(new AuthenticationResponse(jwt));
        } else {
        return ResponseEntity.badRequest().body("{\"message\":\"Invalid email or password\"}");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        
        if (mySQLService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        
        return ResponseEntity.ok(mySQLService.register(user));
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody User user) {
        
        if (mySQLService.findByEmail(user.getEmail()).isEmpty()) {
            return ResponseEntity.badRequest().body("Email does not exists!");
        }
        
        return ResponseEntity.ok(mySQLService.register(user));
    }

    @PostMapping("/checkUserExists")
    public ResponseEntity<?> checkUserExists(@RequestBody User user) {

        Optional<User> foundUser = mySQLService.findByEmail(user.getEmail());

        if (foundUser.isPresent()) {
            return ResponseEntity.ok().body("{\"message\":\"Email exists!\", \"exists\": true}");
        } else {
            return ResponseEntity.ok().body("{\"message\":\"Email does not exists!\", \"exists\": false}");
        }
    }    

    @PostMapping("/transaction")
    public Token saveTokenTransaction(@RequestBody Token token) {

        emailService.sendEmail(token);

        mySQLService.saveToken(token);

        return mongoDBService.cacheTokenCreation(token);
    }

    @PostMapping("/getTransactionStatus")
    public ResponseEntity<String> getTransactionStatus(@RequestBody EtherscanRequest etherscanRequest) {

        String txHash = etherscanRequest.getTxHash();

        return etherscanService.getTransactionStatus(txHash);
    }

}
