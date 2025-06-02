package com.arianewelke.checkFit.service.implement;

import com.arianewelke.checkFit.entity.Activity;
import com.arianewelke.checkFit.repository.ActivityRepository;
import com.arianewelke.checkFit.service.interfaces.ActivityService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ActivityServiceImp implements ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityServiceImp(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
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
        return activityRepository.findById(id).map(existing -> {
            existing.setStartTime(activity.getStartTime());
            existing.setFinishTime(activity.getFinishTime());
            existing.setDescription(activity.getDescription());
            existing.setLimitPeople(activity.getLimitPeople());
            return activityRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Activity not found with id: " + id));
    }

    @Override
    public void delete(Long id) {
        activityRepository.deleteById(id);
    }
}
