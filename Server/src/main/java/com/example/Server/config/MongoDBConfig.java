package com.example.Server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
public class MongoDBConfig {

    @Value("${mongo.url}") 
    private String mongoUrl;

    @Bean
    public MongoTemplate createMongoTemplate(){
    //create a MongoClient
    MongoClient client = MongoClients.create(mongoUrl);
    //put in the name of the database here in this case is "marvel" 
    return new MongoTemplate(client, "token");
    } 

}
