package com.arianewelke.checkFit.controller;

import com.arianewelke.checkFit.dto.LoginRequestDTO;
import com.arianewelke.checkFit.dto.RegisterRequestDTO;
import com.arianewelke.checkFit.dto.ResponseDTO;
import com.arianewelke.checkFit.entity.User;
import com.arianewelke.checkFit.infra.security.TokenService;
import com.arianewelke.checkFit.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO body) {
        Optional<User> optionalUser = this.userRepository.findByEmail(body.email());
        User user = optionalUser.get();

        if (!passwordEncoder.matches(body.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password");
        }

        String token = tokenService.generateToken(user);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequestDTO body) {

//        if (userRepository.existsByEmail(body.email())) {
//            return ResponseEntity.badRequest().body("Email already registered");
//        }
        if (userRepository.existsByEmail(body.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }

        if (userRepository.existsByCpf(body.cpf())) {
            return ResponseEntity.badRequest().body("CPF already registered");
        }

        if(userRepository.existsByPhone(body.phone())) {
            return ResponseEntity.badRequest().body("Phone already registered");
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

        //return ResponseEntity.ok(new ResponseDTO(newUser.getName()));
        return ResponseEntity.status(HttpStatus.CREATED).build();

    }
}

