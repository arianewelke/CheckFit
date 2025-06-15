package com.arianewelke.checkFit.service.implement;

import com.arianewelke.checkFit.dto.CheckinRequestDTO;
import com.arianewelke.checkFit.dto.CheckinResponseDTO;
import com.arianewelke.checkFit.dto.CheckinWithHistoryDTO;
import com.arianewelke.checkFit.entity.Checkin;
import com.arianewelke.checkFit.repository.ActivityRepository;
import com.arianewelke.checkFit.repository.CheckinRepository;
import com.arianewelke.checkFit.repository.UserRepository;
import com.arianewelke.checkFit.service.interfaces.CheckinService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CheckinServiceImp implements CheckinService {

    private final CheckinRepository checkinRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    public CheckinServiceImp(CheckinRepository checkinRepository, UserRepository userRepository, ActivityRepository activityRepository) {
        this.checkinRepository = checkinRepository;
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
    }

    @Override
    public CheckinWithHistoryDTO save(CheckinRequestDTO dto) {
        var activityOptional = activityRepository.findById(dto.idActivity());
        var userOptional = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());

        if (activityOptional.isEmpty() || userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User or activity not found");
        }

        var activity = activityOptional.get();
        var user = userOptional.get();
        var now = LocalDateTime.now();

        if (activity.getFinishTime().isBefore(now)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to check in to an activity that has already finished");
        }

        long checkinCount = checkinRepository.countByActivityId(activity.getId());
        if (checkinCount >= activity.getLimitPeople()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "maximum number of people reached");
        }

        if (checkinRepository.existsByUserAndActivity(user, activity)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User has already checked in this activity");
        }

        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);

        boolean alreadyCheckedToday = checkinRepository.existsByUserAndCheckinTimeBetween(user, startOfDay, endOfDay);
        if (alreadyCheckedToday) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User has already checked today");
        }

        var checkin = new Checkin(user, activity);
        checkinRepository.save(checkin);

        var current = new CheckinResponseDTO(user.getName(), activity.getDescription(), checkin.getCheckinTime());

        var history = checkinRepository.findByUserOrderByCheckinTimeDesc(user).stream()
                .map(c -> new CheckinResponseDTO(
                        c.getUser().getName(),
                        c.getActivity().getDescription(),
                        c.getCheckinTime()
                ))
                .toList();

        return new CheckinWithHistoryDTO(current, history);
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
                       .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Checkin Not Found with ID: " + id));
            existingCheckin.setCheckinTime(checkin.getCheckinTime());
            return checkinRepository.save(existingCheckin);
    }

    @Override
    public void delete(Long id) {
        checkinRepository.deleteById(id);
    }

    public List<CheckinResponseDTO> getUserCheckinsHistory() {
        var userOptional = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());

        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
        }

        var user = userOptional.get();
        var checkins = checkinRepository.findByUserOrderByCheckinTimeDesc(user);

        return checkins.stream()
                .map(c -> new CheckinResponseDTO(
                        c.getUser().getName(),
                        c.getActivity().getDescription(),
                        c.getCheckinTime()
                ))
                .toList();
    }

}
