package com.arianewelke.checkFit.dto;

public record AvailabilityResponseDTO(Long activityId, String activityDescription, int totalSlots, long occupiedSlots, long availableSlots) {
}
