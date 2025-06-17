package com.arianewelke.checkFit.dto;

import java.time.LocalDateTime;

public record ActivityRequestDTO(String description,
                                 LocalDateTime finishTime,
                                 LocalDateTime startTime,
                                 int limitPeople) {
}


