package com.arianewelke.checkFit.service.interfaces;

import com.arianewelke.checkFit.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User save(User user);
    List<User> findAll();
    Optional<User> findById(Long id);
    User update(Long id, User user);
    void delete(Long id);
    List<User> findByEmail(String user);

    void deleteById(Long id);
}
