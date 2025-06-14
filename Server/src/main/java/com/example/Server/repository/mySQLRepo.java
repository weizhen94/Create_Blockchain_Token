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

import com.example.Server.model.AddLiquidity;
import com.example.Server.model.RepoOtp;
import com.example.Server.model.Swap;
import com.example.Server.model.Token;
import com.example.Server.model.User;

@Repository
public class mySQLRepo {

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

    public void insertToken(Token token) {
        final String insertTokenSQL = "insert into token (token_name, token_symbol, decimals, total_supply, contract_address, transaction_hash, user_address, user_email) values (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertTokenSQL, token.getTokenName(), token.getTokenSymbol(), token.getDecimals(), token.getTotalSupply(), token.getContractAddress(), token.getTransactionHash(), token.getUserAddress(), token.getUserEmail());
    }

    public List<Token> findTokensByEmail(String email) {
        final String findTokensByEmailSQL = "select * from token where user_email = ?";
        List<Token> tokens = jdbcTemplate.query(findTokensByEmailSQL, BeanPropertyRowMapper.newInstance(Token.class), email);
        return tokens;
    }

    public void insertAddLiquidity(AddLiquidity addLiquidity) {
        final String insertAddLiquiditySQL = "insert into liquidity (token, amount_token, liquidity_pair, amount_liquidity_pair, transaction_hash, user_email) values (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertAddLiquiditySQL, addLiquidity.getToken(), addLiquidity.getAmountToken(), addLiquidity.getLiquidityPair(), addLiquidity.getAmountLiquidityPair(), addLiquidity.getTransactionHash(), addLiquidity.getUserEmail());
    }

    public List<AddLiquidity> findLiquidityByEmail(String email) {
        final String findLiquidityByEmailSQL = "select * from liquidity where user_email = ?";
        List<AddLiquidity> addLiquidity = jdbcTemplate.query(findLiquidityByEmailSQL, BeanPropertyRowMapper.newInstance(AddLiquidity.class), email);
        return addLiquidity;
    }

    public void insertSwap(Swap swap) {
        final String insertSwapSQL = "insert into swap (token_in, amount_in, token_out, transaction_hash, user_email) values (?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertSwapSQL, swap.getTokenIn(), swap.getAmountIn(), swap.getTokenOut(), swap.getTransactionHash(), swap.getUserEmail());
    }

    public List<Swap> findSwapByEmail(String email) {
        final String findSwapByEmailSQL = "select * from swap where user_email = ?";
        List<Swap> swap = jdbcTemplate.query(findSwapByEmailSQL, BeanPropertyRowMapper.newInstance(Swap.class), email);
        return swap;
    }
    
}
