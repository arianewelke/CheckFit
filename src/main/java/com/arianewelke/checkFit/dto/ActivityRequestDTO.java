package com.arianewelke.checkFit.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record ActivityRequestDTO(String description,
                                 LocalDateTime finishTime,
                                 LocalDateTime startTime,
                                 int limitPeople) {
}


