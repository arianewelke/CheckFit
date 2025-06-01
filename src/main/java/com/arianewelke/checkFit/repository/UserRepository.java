package com.arianewelke.checkFit.repository;

import com.arianewelke.checkFit.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
}
