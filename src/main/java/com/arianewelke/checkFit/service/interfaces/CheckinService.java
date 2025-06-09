package com.arianewelke.checkFit.service.interfaces;

import com.arianewelke.checkFit.dto.CheckinRequestDTO;
import com.arianewelke.checkFit.dto.CheckinResponseDTO;
import com.arianewelke.checkFit.entity.Checkin;

import java.util.List;
import java.util.Optional;

public interface CheckinService {
    CheckinResponseDTO save(CheckinRequestDTO dto);
    List<Checkin> findAll();
    Optional<Checkin> findById(Long id);
    Checkin update(Long id, Checkin checkin);
    void delete(Long id);
}
