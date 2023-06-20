package com.example.Server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Server.model.Token;
import com.example.Server.repository.monggoDBRepo;

@Service
public class mongoDBService {

    @Autowired
    private monggoDBRepo monggoDBRepo;

    public Token cacheTokenCreation(Token token) {
        monggoDBRepo.saveTokenCreation(token);
        System.out.println("Token caching saved!");
        return token;
    }
    
}
