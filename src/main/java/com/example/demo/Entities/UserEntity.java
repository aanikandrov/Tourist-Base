package com.example.demo.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "User_Table")
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "User_ID")
    @JsonProperty("userID")
    private Long userID;

    @Column(name = "User_Name", nullable = false, length = 200, unique = true)
    @JsonProperty("userName")
    private String userName;

    @Column(name = "User_Password", length = 68)
    private String userPassword;

    @JsonProperty("userRole")
    @Column(name = "User_Role", length = 50)
    private String userRole;

    @JsonProperty("phone")
    @Column(name = "Phone", length = 20, unique = true)
    private String phone;

    @Column(name = "Birth_Date")
    @JsonProperty("birthDate")
    private LocalDate birthDate;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + userRole));
    }

    @Override
    public String getPassword() {
        return userPassword;
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Конструкторы
    public UserEntity() {
    }

    public UserEntity(Long userID, String userName, String userPassword) {
        this.userID = userID;
        this.userName = userName;
        this.userPassword = userPassword;
    }

    public UserEntity(Long userID, String userName, String userPassword, String userRole, String phone, LocalDate birthDate) {
        this.userID = userID;
        this.userName = userName;
        this.userPassword = userPassword;
        this.userRole = userRole;
        this.phone = phone;
        this.birthDate = birthDate;
    }

    public UserEntity(UserEntity user) {
        this.userName = user.getUserName();
        this.userPassword = user.getUserPassword();
        this.phone = user.getPhone();
        this.birthDate = user.getBirthDate();
        this.userRole = user.getUserRole();
    }


    public UserEntity(String userName) {
        this.userName = userName;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
}