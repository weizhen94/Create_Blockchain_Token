package com.example.Server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Server.model.TokenCaching;
import com.example.Server.service.TokenCachingService;

@RestController
@RequestMapping("/api")
public class TokenCreationController {

    @Autowired
    private TokenCachingService tokenCachingService; 

    @PostMapping("/transaction")
    public TokenCaching saveTokenTransaction(@RequestBody TokenCaching tokenCaching) {
        return tokenCachingService.cacheTokenCreation(tokenCaching);
    }
    
}
