package com.arianewelke.checkFit.dto;

import com.arianewelke.checkFit.entity.Checkin;

import java.time.LocalDateTime;

public record CheckinResponseDTO(String name, String description, LocalDateTime checkinTime) {
    public CheckinResponseDTO(Checkin checkin) {
        this(
                String.valueOf(checkin.getId()),
                checkin.getActivity().getDescription(),
                checkin.getActivity().getStartTime()
        );
    }
}
