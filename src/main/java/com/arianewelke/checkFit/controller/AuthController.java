package com.arianewelke.checkFit.controller;

import com.arianewelke.checkFit.dto.LoginRequestDTO;
import com.arianewelke.checkFit.dto.RegisterRequestDTO;
import com.arianewelke.checkFit.dto.ResponseDTO;
import com.arianewelke.checkFit.entity.User;
import com.arianewelke.checkFit.exceptions.BusinessExceptions;
import com.arianewelke.checkFit.infra.security.TokenService;
import com.arianewelke.checkFit.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
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

        if (userRepository.existsByEmail(body.email())) {
            throw new BusinessExceptions("Email already registered");
        }

        if (userRepository.existsByCpf(body.cpf())) {
            throw new BusinessExceptions("CPF already registered");
        }

        if(userRepository.existsByPhone(body.phone())) {
            throw new BusinessExceptions("Phone already registered");
        }

        if (!body.phone().matches("^\\d{10,11}$")) {
            throw new BusinessExceptions("Phone number must contain 10 or 11 digits");
        }
        if (!body.cpf().matches("^\\d{11}$")) {
            throw new BusinessExceptions("CPF must contain exactly 11 digits");
        }
        if (!body.password().matches("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")) {
            throw new BusinessExceptions("Password must have at least 8 characters, including letters and numbers");
        }
        if (!body.email().matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            throw new BusinessExceptions("Invalid email format");
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

        URI location = URI.create("/user/" + newUser.getId());
        ResponseDTO response = new ResponseDTO(newUser.getName());
        return ResponseEntity.created(location).body(response);

    }
}

