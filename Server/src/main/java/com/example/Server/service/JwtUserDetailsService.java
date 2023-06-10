package com.example.Server.service;

import com.example.Server.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.example.Server.model.User user = userRepo.findUserEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new User(user.getEmail(), user.getPassword(), new ArrayList<>());
    }
}

