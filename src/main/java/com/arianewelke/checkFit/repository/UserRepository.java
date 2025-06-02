package com.arianewelke.checkFit.repository;

import com.arianewelke.checkFit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
