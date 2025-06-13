package com.arianewelke.checkFit.controller;

import com.arianewelke.checkFit.dto.LoginRequestDTO;
import com.arianewelke.checkFit.dto.RegisterRequestDTO;
import com.arianewelke.checkFit.dto.ResponseDTO;
import com.arianewelke.checkFit.entity.User;
import com.arianewelke.checkFit.infra.security.TokenService;
import com.arianewelke.checkFit.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/auth")

public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO body) {
        User user = this.userRepository.findByEmail(body.email()).orElseThrow(() -> new RuntimeException("User not found"));
        if (passwordEncoder.matches(body.password(), user.getPassword())) {
            String token = this.tokenService.generateToken(user);
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO body) {
        Optional<User> user = this.userRepository.findByEmail(body.email());
        if (user.isPresent()) {
            return ResponseEntity.badRequest().body("User already exist.");
        }
        var newUser = new User();
        newUser.setName(body.name());
        newUser.setEmail(body.email());
        newUser.setPhone(body.phone());
        newUser.setCpf(body.cpf());
        newUser.setDateBirth(body.dateBirth());
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setPassword(passwordEncoder.encode(body.password()));

        this.userRepository.save(newUser);

        return ResponseEntity.ok(new ResponseDTO(newUser.getName()));

    }
}

