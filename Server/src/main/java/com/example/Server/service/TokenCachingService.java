package com.example.Server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Server.model.TokenCaching;
import com.example.Server.repository.TokenCachingRepo;

@Service
public class TokenCachingService {

    @Autowired
    private TokenCachingRepo tokenCachingRepo;

    public TokenCaching cacheTokenCreation(TokenCaching tokenCaching) {
        System.out.println("Token caching saved!");
        tokenCachingRepo.saveTokenCreation(tokenCaching);
        return tokenCaching;
    }
    
}
