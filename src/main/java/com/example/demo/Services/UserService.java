package com.example.demo.Services;

import com.example.demo.Controllers.DTO.UserUpdateDTO;
import com.example.demo.Entities.UserEntity;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<String> getAllUserNames() {
        List<UserEntity> users = userRepository.findAll();
        return users.stream()
                .map(UserEntity::getUserName)
                .toList();
    }

    public List<UserEntity> getAllUsers() {
        List<UserEntity> users = userRepository.findAll();
        return users;
    }

    @Transactional
    public void updateUser(Long id, UserUpdateDTO updateDTO) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUserName(updateDTO.getUserName());
        user.setPhone(updateDTO.getPhone());
        user.setBirthDate(updateDTO.getBirthDate());

        userRepository.save(user);
    }



    public Optional<UserEntity> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<UserEntity> getUserByName(String userName) {
        return userRepository.findByuserName(userName);
    }

    public UserEntity addUserByName(UserEntity newUser) {
        return userRepository.save(newUser);
    }

    @Transactional
    public UserEntity updateUser(String userName, UserUpdateDTO updateDTO) {
        UserEntity user = userRepository.findByuserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUserName(updateDTO.getUserName());
        user.setPhone(updateDTO.getPhone());
        user.setBirthDate(updateDTO.getBirthDate());

        userRepository.save(user);

        return user;
    }

    public UserEntity addUser(UserEntity user) {
        if (userRepository.existsByuserName(user.getUserName())) {
            throw new RuntimeException("Username already exists");
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

}
