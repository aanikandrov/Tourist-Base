package com.example.demo.Controllers;

import com.example.demo.Config.JwtUtils;
import com.example.demo.Controllers.DTO.LoginDTO;
import com.example.demo.Controllers.DTO.RegistrationDTO;
import com.example.demo.Entities.UserEntity;
import com.example.demo.Repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils,
            UserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid LoginDTO loginDto) {
        UserEntity user = userRepository.findByUserName(loginDto.getUserName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getUserPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtUtils.generateToken(userDetails);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "userID", user.getUserID(),
                "userName", user.getUsername(),
                "userrole", user.getUserRole()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegistrationDTO registrationDto) {
        if (userRepository.findByUserName(registrationDto.getUserName()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Username is already taken"));
        }

        if (userRepository.existsByPhone(registrationDto.getPhone())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Phone is already taken"));
        }

        UserEntity newUser = new UserEntity();
        newUser.setUserName(registrationDto.getUserName());
        newUser.setUserPassword(passwordEncoder.encode(registrationDto.getPassword()));
        newUser.setUserRole("USER");
        newUser.setPhone(registrationDto.getPhone());
        newUser.setBirthDate(registrationDto.getBirthDate());

        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "userID", newUser.getUserID(),
                "userName", newUser.getUsername(),
                "userrole", newUser.getUserRole(),
                "phone", newUser.getPhone(),
                "birthDate", newUser.getBirthDate()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().body(Map.of("message", "Logged out successfully"));
    }
}