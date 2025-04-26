package com.example.demo.Controllers.EntityControllers;

import com.example.demo.Controllers.DTO.RegistrationDTO;
import com.example.demo.Controllers.DTO.UserUpdateDTO;
import com.example.demo.Entities.UserEntity;
import com.example.demo.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    private final PasswordEncoder passwordEncoder;

    public UserController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable Long id) {
        Optional<UserEntity> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/names")
    public List<String> getAllUserNames() {
        return userService.getAllUserNames();
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserEntity> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable("id") Long id,
            @RequestBody UserUpdateDTO updateDTO) {
        try {
            userService.updateUser(id, updateDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateCurrentUser(
            @RequestBody UserUpdateDTO updateDTO,
            Principal principal) {
        try {
            UserEntity updatedUser = userService.updateUser(principal.getName(), updateDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserEntity> getCurrentUser(Principal principal) {
        Optional<UserEntity> user = userService.getUserByName(principal.getName());
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationDTO registrationDTO) {
        try {
            System.out.println("Controller:" + registrationDTO.getUserName());

            UserEntity newUser = new UserEntity();
            newUser.setUserName(registrationDTO.getUserName());
            newUser.setUserPassword(passwordEncoder.encode(registrationDTO.getPassword()));
            newUser.setPhone(registrationDTO.getPhone());
            newUser.setBirthDate(registrationDTO.getBirthDate());
            newUser.setUserRole("USER");

            userService.addUser(newUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Пользователь удален");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка удаления: " + e.getMessage());
        }
    }


    @PostMapping("/{userName}")
    public ResponseEntity<UserEntity> addUserByName(
            @PathVariable String userName) {

        UserEntity newUser = new UserEntity(userName);
        UserEntity createdUser = userService.addUserByName(newUser);

        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
}
