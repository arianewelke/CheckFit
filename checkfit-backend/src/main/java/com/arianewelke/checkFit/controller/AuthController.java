package com.arianewelke.checkFit.controller;

import com.arianewelke.checkFit.dto.LoginRequestDTO;
import com.arianewelke.checkFit.dto.RegisterRequestDTO;
import com.arianewelke.checkFit.entity.User;
import com.arianewelke.checkFit.entity.UserRole;
import com.arianewelke.checkFit.exceptions.BusinessExceptions;
import com.arianewelke.checkFit.infra.security.TokenService;
import com.arianewelke.checkFit.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

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
        var user = userRepository.findByEmail(body.email())
                .orElseThrow(() -> new BusinessExceptions(
                        "USER_NOT_FOUND",
                        "Usuário não encontrado. Verifique seu e-mail."
                ));

        if (!passwordEncoder.matches(body.password(), user.getPassword())) {
            throw new BusinessExceptions(
                    "INVALID_PASSWORD",
                    "Senha incorreta. Tente novamente."
            );
        }

        String token = tokenService.generateToken(user);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequestDTO body) {
        validateUniqueUserData(body);

        if (!body.phone().matches("^\\d{10,11}$")) {
            throw new BusinessExceptions(
                    "INVALID_PHONE",
                    "O telefone deve conter 10 ou 11 dígitos."
            );
        }
        if (!body.cpf().matches("^\\d{11}$")) {
            throw new BusinessExceptions(
                    "INVALID_CPF",
                    "O CPF deve conter exatamente 11 dígitos."
            );
        }
        if (!body.password().matches("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")) {
            throw new BusinessExceptions(
                    "INVALID_PASSWORD_FORMAT",
                    "A senha deve ter pelo menos 8 caracteres, incluindo letras e números."
            );
        }
        if (!body.email().matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            throw new BusinessExceptions(
                    "INVALID_EMAIL",
                    "Formato de e-mail inválido."
            );
        }

        var newUser = new User();
        newUser.setName(body.name());
        newUser.setEmail(body.email());
        newUser.setPhone(body.phone());
        newUser.setCpf(body.cpf());
        newUser.setDateBirth(body.dateBirth());
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setPassword(passwordEncoder.encode(body.password()));
        newUser.setRole(UserRole.USER);

        this.userRepository.save(newUser);

        String token = tokenService.generateToken(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(token);
    }

    @PostMapping("/register-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerAdmin(@RequestBody @Valid RegisterRequestDTO body) {
        validateUniqueUserData(body);

        var newAdmin = new User();
        newAdmin.setName(body.name());
        newAdmin.setEmail(body.email());
        newAdmin.setPhone(body.phone());
        newAdmin.setCpf(body.cpf());
        newAdmin.setDateBirth(body.dateBirth());
        newAdmin.setCreatedAt(LocalDateTime.now());
        newAdmin.setPassword(passwordEncoder.encode(body.password()));
        newAdmin.setRole(UserRole.ADMIN);

        userRepository.save(newAdmin);

        String token = tokenService.generateToken(newAdmin);
        return ResponseEntity.status(HttpStatus.CREATED).body(token);
    }

    private void validateUniqueUserData(RegisterRequestDTO body) {
        if (userRepository.existsByEmail(body.email())) {
            throw new BusinessExceptions(
                    "EMAIL_ALREADY_REGISTERED",
                    "Este e-mail já está cadastrado."
            );
        }

        if (userRepository.existsByCpf(body.cpf())) {
            throw new BusinessExceptions(
                    "CPF_ALREADY_REGISTERED",
                    "Este CPF já está cadastrado."
            );
        }

        if (userRepository.existsByPhone(body.phone())) {
            throw new BusinessExceptions(
                    "PHONE_ALREADY_REGISTERED",
                    "Este telefone já está cadastrado."
            );
        }
    }
}
