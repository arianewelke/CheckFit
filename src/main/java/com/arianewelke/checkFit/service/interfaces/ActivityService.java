package com.arianewelke.checkFit.service.interfaces;

import com.arianewelke.checkFit.entity.Activity;

import java.util.List;
import java.util.Optional;

public interface ActivityService {
    Activity save(Activity activity);
    List<Activity> findAll();
    Optional<Activity> findById(Long id);
    Activity update(Long id, Activity activity);
    void delete(Long id);
}
