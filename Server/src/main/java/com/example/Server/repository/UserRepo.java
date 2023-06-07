package com.example.Server.repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import com.example.Server.model.RepoOtp;
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

    public RepoOtp getOtpByEmail(String email) {
        final String findOtpSQL = "select * from registerOTP where email = ?";
        SqlRowSet rs = jdbcTemplate.queryForRowSet(findOtpSQL, email);
        
        if (rs.next()) {
            RepoOtp repoOtp = new RepoOtp(); 
            repoOtp.setEmail(rs.getString("email")); 
            repoOtp.setOtp(rs.getString("otp"));
            Timestamp timestamp = rs.getTimestamp("otp_expiry");
            
            if (timestamp != null) {
                repoOtp.setOtpExpiry(timestamp.toLocalDateTime());
            } else {
                System.out.println("No expiry timestamp found for email: " + email);
            }
            return repoOtp;
        } else {
            return null;
        }
    }    
    
    public User upsertUser(User user){
        final String insertSQL = "insert into user (email, password) values (?, ?)" + "on duplicate key update password = ?";
        jdbcTemplate.update(insertSQL, user.getEmail(), user.getPassword(), user.getPassword());
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
