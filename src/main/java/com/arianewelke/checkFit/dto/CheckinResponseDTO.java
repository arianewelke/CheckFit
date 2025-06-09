package com.arianewelke.checkFit.dto;

import java.time.LocalDateTime;

public record CheckinResponseDTO(String name, String description, LocalDateTime checkinTime) {
}
