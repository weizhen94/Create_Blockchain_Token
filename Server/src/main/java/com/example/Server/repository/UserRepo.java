package com.example.Server.repository;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.Server.model.User;

@Repository
public class UserRepo {

    @Autowired
    JdbcTemplate jdbcTemplate; 

    public void upsertUserOTP(String email, String otp, LocalDateTime otpExpiry) {
        final String insertRegisterOTPSQL = "insert into registerOTP (email, otp, otp_expiry) values (?, ?, ?)" + "on duplicate key update otp = ?, otp_expiry = ?";
        jdbcTemplate.update(insertRegisterOTPSQL, email, otp, otpExpiry, otp, otpExpiry);
    }

    public void deleteExpiredOtp() {
        final String deleteExpiredOtpSQL = "delete from registerOTP where otp_expiry < ?";
        jdbcTemplate.update(deleteExpiredOtpSQL, LocalDateTime.now(ZoneOffset.UTC));
    }    

    public User insertUser(User user){
        final String insertSQL = "insert into user (email, password) values (?, ?)";
        jdbcTemplate.update(insertSQL, user.getEmail(), user.getPassword());
        return user; 
    }

    public Optional<User> findUserEmail(String email) {
        final String findByEmailSQL = "select * from user where email = ?"; 
        List<User> users = jdbcTemplate.query(findByEmailSQL, BeanPropertyRowMapper.newInstance(User.class), email); 
        if(users.isEmpty()){
            return Optional.empty();
        }else{
            return Optional.of(users.get(0));
        }
    }
    
}
