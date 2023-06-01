package com.example.Server.service;

import org.springframework.stereotype.Service;

import com.example.Server.model.User;
import com.example.Server.repository.UserRepo;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    // @Autowired
    // private BCryptPasswordEncoder passwordEncoder;

    public User register(User user) {
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepo.insertUser(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findUserEmail(email);
    }
}
