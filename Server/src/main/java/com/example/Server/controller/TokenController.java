package com.example.Server.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/transaction")
    public TokenCaching saveTokenTransaction(@RequestBody TokenCaching tokenCaching) {
        emailService.sendEmail(tokenCaching);
        return tokenCachingService.cacheTokenCreation(tokenCaching);
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

}
