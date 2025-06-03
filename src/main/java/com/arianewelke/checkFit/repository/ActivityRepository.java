package com.arianewelke.checkFit.repository;

import com.arianewelke.checkFit.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}
