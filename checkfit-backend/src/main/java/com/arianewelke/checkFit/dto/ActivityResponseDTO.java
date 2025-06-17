package com.arianewelke.checkFit.dto;

import java.time.LocalDateTime;

public record ActivityResponseDTO(Long id, String description, LocalDateTime startTime, LocalDateTime finishTime, int limitPeople) {

}
