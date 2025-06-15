package com.arianewelke.checkFit.controller;

import com.arianewelke.checkFit.dto.ActivityRequestDTO;
import com.arianewelke.checkFit.dto.ActivityResponseDTO;
import com.arianewelke.checkFit.entity.Activity;
import com.arianewelke.checkFit.repository.ActivityRepository;
import com.arianewelke.checkFit.service.interfaces.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/activity")
public class ActivityController {

    private final ActivityService activityService;
    private final ActivityRepository activityRepository;
    private java.time.LocalDateTime LocalDateTime;

    public ActivityController(ActivityService activityService, ActivityRepository activityRepository) {
        this.activityService = activityService;
        this.activityRepository = activityRepository;
    }

    @PostMapping
    public ResponseEntity<ActivityResponseDTO> create(@RequestBody ActivityRequestDTO dto) {
        Activity activity = new Activity();
        activity.setDescription(dto.description());
        activity.setStartTime(dto.startTime());
        activity.setFinishTime(dto.finishTime());
        activity.setLimitPeople(dto.limitPeople());

        activityRepository.save(activity);

        return ResponseEntity.ok(
                new ActivityResponseDTO(
                        activity.getId(),
                        activity.getDescription(),
                        activity.getStartTime(),
                        activity.getFinishTime(),
                        activity.getLimitPeople()
                )
        );
    }


    @GetMapping
    public ResponseEntity<List<Activity>>findAll() {
        return ResponseEntity.ok(activityService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> findById(@PathVariable Long id) {
        return activityService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> update(@PathVariable Long id, @RequestBody Activity activity) {
        return ResponseEntity.ok(activityService.update(id, activity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Activity> delete(@PathVariable Long id) {
        activityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
