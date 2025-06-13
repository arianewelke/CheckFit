package com.arianewelke.checkFit.service.implement;

import com.arianewelke.checkFit.dto.CheckinResponseDTO;
import com.arianewelke.checkFit.entity.Activity;
import com.arianewelke.checkFit.entity.Checkin;
import com.arianewelke.checkFit.entity.User;
import com.arianewelke.checkFit.repository.ActivityRepository;
import com.arianewelke.checkFit.repository.CheckinRepository;
import com.arianewelke.checkFit.repository.UserRepository;
import com.arianewelke.checkFit.service.interfaces.ActivityService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ActivityServiceImp implements ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final CheckinRepository checkinRepository;

    public ActivityServiceImp(ActivityRepository activityRepository, UserRepository userRepository, CheckinRepository checkinRepository) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
        this.checkinRepository = checkinRepository;
    }

    @Override
    public Activity save(Activity activity) {
        return activityRepository.save(activity);
    }

    @Override
    public List<Activity> findAll() {
        return activityRepository.findAll();
    }

    @Override
    public Optional<Activity> findById(Long id) {
        return activityRepository.findById(id);
    }

    @Override
    public Activity update(Long id, Activity activity) {
        Activity oldActivity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found with id: " + id));
        oldActivity.setDescription(activity.getDescription());
        oldActivity.setStartTime(activity.getStartTime());
        oldActivity.setFinishTime(activity.getFinishTime());
        oldActivity.setLimitPeople(activity.getLimitPeople());
        return activityRepository.save(oldActivity);
    }

    @Override
    public void delete(Long id) {
        activityRepository.deleteById(id);
    }

}
