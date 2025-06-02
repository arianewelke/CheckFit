package com.arianewelke.checkFit.service.interfaces;

import com.arianewelke.checkFit.entity.Checkin;

import java.util.List;
import java.util.Optional;

public interface CheckinService {
    Checkin save(Checkin checkin);
    List<Checkin> findAll();
    Optional<Checkin> findById(Long id);
    Checkin update(Long id, Checkin checkin);
    void delete(Long id);
}
