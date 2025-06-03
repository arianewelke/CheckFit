package com.arianewelke.checkFit.service.implement;

import com.arianewelke.checkFit.entity.Checkin;
import com.arianewelke.checkFit.repository.CheckinRepository;
import com.arianewelke.checkFit.service.interfaces.CheckinService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CheckinServiceImp implements CheckinService {

    private final CheckinRepository checkinRepository;

    public CheckinServiceImp(CheckinRepository checkinRepository) {
        this.checkinRepository = checkinRepository;
    }

    @Override
    public Checkin save(Checkin checkin) {
        return checkinRepository.save(checkin);
    }

    @Override
    public List<Checkin> findAll() {
        return checkinRepository.findAll();
    }

    @Override
    public Optional<Checkin> findById(Long id) {
        return checkinRepository.findById(id);
    }

    @Override
    public Checkin update(Long id, Checkin checkin) {
       Checkin existingCheckin = checkinRepository.findById(id)
                       .orElseThrow(() -> new RuntimeException("Checkin Not Found with ID: " + id));
            existingCheckin.setCheckinTime(checkin.getCheckinTime());
            return checkinRepository.save(existingCheckin);
    }

    @Override
    public void delete(Long id) {
        checkinRepository.deleteById(id);
    }
}
