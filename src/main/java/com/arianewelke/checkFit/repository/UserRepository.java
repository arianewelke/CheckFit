package com.arianewelke.checkFit.repository;

import com.arianewelke.checkFit.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Long id(Long id);

    boolean existsByEmail(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email);

    boolean existsByCpf(@NotBlank(message = "CPF is required") @Pattern(regexp = "\\d{11}", message = "CPF must have exactly 11 numeric digits") String cpf);

    boolean existsByPhone(@NotBlank(message = "Phone is required") @Pattern(regexp="\\d{11}", message = "Phone number must have exactly 11 numeric digits") String phone);
}