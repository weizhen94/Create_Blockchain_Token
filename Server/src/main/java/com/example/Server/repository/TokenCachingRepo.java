package com.example.Server.repository;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.example.Server.model.TokenCaching;

@Repository
public class TokenCachingRepo {

    @Autowired
    private MongoTemplate template;

//this is the way to type the JsonBody in AdvancedRestClient
/*
{
"transactionHash": "123", 
"network": "eth", 
"tokenName": "ABCoin",
"tokenSymbol": "ABC",
"totalSupply": "1000", 
"userAddress": "0xd",
"otherAddress": "0xe",
"contractAddress": "0xf", 
"timestamp": "2023-05-06T14:10:26.351+0000"
}
*/
    //This method takes a TokenCreation object as a parameter and saves it to the "creation" collection in the MongoDB database.
    public void saveTokenCreation(TokenCaching tokenCache) {
        //It first creates a new Document object, which represents a MongoDB document that will be inserted into the database.
        Document doc = new Document(); 
        //Then, it populates the Document object with the fields of the Comment object (i.e., text, timestamp, and characterId).
        doc.put("transactionHash", tokenCache.getTransactionHash()); 
        doc.put("network", tokenCache.getNetwork()); 
        doc.put("tokenName", tokenCache.getTokenName()); 
        doc.put("tokenSymbol", tokenCache.getTokenSymbol()); 
        doc.put("totalSupply", tokenCache.getTotalSupply()); 
        doc.put("userAddress", tokenCache.getUserAddress()); 
        doc.put("otherAddress", tokenCache.getOtherAddress()); 
        doc.put("contractAddress", tokenCache.getContractAddress()); 
        doc.put("timestamp", tokenCache.getTimestamp()); 
        //the template.insert() method is called with the Document object and the collection name "comment". 
        //This method inserts the Document object into the "comment" collection in the MongoDB database.
        template.insert(doc, "creationCache");
    }

}
