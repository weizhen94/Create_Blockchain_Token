package com.example.Server.service;

import java.io.IOException;
import java.nio.charset.Charset;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.ResponseExtractor;
import org.springframework.web.client.RestTemplate;

class HeaderRemover implements ResponseErrorHandler {
    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        // Assume don't want to treat any response as an error
        return false;
    }

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        // Do nothing on error
    }
}

@Service
public class EtherscanService {
    private final RestTemplate restTemplate;

    public EtherscanService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .errorHandler(new HeaderRemover())
                .build();
    }

    public ResponseEntity<String> getTransactionStatus(String txHash) {
        String etherscanUrl = String.format("https://api-sepolia.etherscan.io/api?module=transaction&action=getstatus&txhash=%s&apikey=", txHash);
        return this.restTemplate.execute(etherscanUrl, HttpMethod.GET, null, 
            new ResponseExtractor<ResponseEntity<String>>() {
                @Override
                public ResponseEntity<String> extractData(ClientHttpResponse response) throws IOException {
                    // Parse the body to a string
                    String body = StreamUtils.copyToString(response.getBody(), Charset.defaultCharset());
                    // Build a new ResponseEntity and avoid including the original headers
                    return ResponseEntity.status(response.getStatusCode().value()).body(body);
                }
        });
    }
}
