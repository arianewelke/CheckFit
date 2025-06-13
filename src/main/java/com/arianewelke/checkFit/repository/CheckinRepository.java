package com.arianewelke.checkFit.repository;

import com.arianewelke.checkFit.entity.Activity;
import com.arianewelke.checkFit.entity.Checkin;
import com.arianewelke.checkFit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CheckinRepository extends JpaRepository<Checkin, Long> {

    long countByActivityId(Long activityId);

    boolean existsByUserAndActivity(User user, Activity activity);

    boolean existsByUserAndCheckinTimeBetween(User user, LocalDateTime start, LocalDateTime end);

    List<Checkin>  findByUserOrderByCheckinTimeDesc(User user);
}
