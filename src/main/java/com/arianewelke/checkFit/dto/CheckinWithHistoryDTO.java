package com.arianewelke.checkFit.dto;

import java.util.List;

public record CheckinWithHistoryDTO(CheckinResponseDTO current, List<CheckinResponseDTO> history) {

}
