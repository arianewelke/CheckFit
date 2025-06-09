package com.arianewelke.checkFit.dto;

import java.time.LocalDate;

public record RegisterRequestDTO (String name, String email, String phone, String cpf, LocalDate dateBirth, String password) {
}
