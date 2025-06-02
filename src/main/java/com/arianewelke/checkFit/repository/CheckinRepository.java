package com.arianewelke.checkFit.repository;

import com.arianewelke.checkFit.entity.Checkin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckinRepository extends JpaRepository<Checkin, Long> {
}
