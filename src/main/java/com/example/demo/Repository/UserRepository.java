package com.example.demo.Repository;

import com.example.demo.Entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    List<UserEntity> findAll();

    Optional<UserEntity> findByUserID(Long userID);

    Optional<UserEntity> findByUserName(String userName);

    boolean existsByuserName(String userName);

    boolean existsByPhone(String phone);
}
