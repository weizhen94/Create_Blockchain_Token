package com.example.Server.model;

import java.time.LocalDateTime;

public class RepoOtp {

    private String email;
    private String otp;
    private LocalDateTime otpExpiry;
    
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getOtp() {
        return otp;
    }
    public void setOtp(String otp) {
        this.otp = otp;
    }
    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }
    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
    } 
    
}
