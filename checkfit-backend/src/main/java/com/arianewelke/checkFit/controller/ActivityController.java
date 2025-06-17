package com.arianewelke.checkFit.controller;

import com.arianewelke.checkFit.dto.ActivityRequestDTO;
import com.arianewelke.checkFit.dto.ActivityResponseDTO;
import com.arianewelke.checkFit.dto.AvailabilityResponseDTO;
import com.arianewelke.checkFit.entity.Activity;
import com.arianewelke.checkFit.repository.ActivityRepository;
import com.arianewelke.checkFit.service.interfaces.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public ResponseEntity<List<ActivityResponseDTO>>findAll() {
        List<Activity> activity = activityRepository.findAll();

        List<ActivityResponseDTO> dtos = activity.stream()
                .map(a -> new ActivityResponseDTO(
                        a.getId(),
                        a.getDescription(),
                        a.getStartTime(),
                        a.getFinishTime(),
                        a.getLimitPeople()
                ))
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> findById(@PathVariable Long id) {
        return activityService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<AvailabilityResponseDTO> getAvailability(@PathVariable Long id) {
        var activityOptional = activityRepository.findById(id);

        if (activityOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var activity = activityOptional.get();
        long checkinCount = activity.getCheckins().size();

        long availableSlots = activity.getLimitPeople() - checkinCount;

        var response = new AvailabilityResponseDTO(
                activity.getId(),
                activity.getDescription(),
                activity.getLimitPeople(),
                checkinCount,
                Math.max(availableSlots, 0)
        );

        return ResponseEntity.ok(response);
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
