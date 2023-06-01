package com.example.Server.repository;

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
