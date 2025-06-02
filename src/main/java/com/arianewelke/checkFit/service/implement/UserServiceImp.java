package com.arianewelke.checkFit.service.implement;

import com.arianewelke.checkFit.entity.User;
import com.arianewelke.checkFit.repository.UserRepository;
import com.arianewelke.checkFit.service.interfaces.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;

    public UserServiceImp(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User update(Long id, User user) {
        return userRepository.findById(id).map(existing -> {
            existing.setName(user.getName());
            existing.setEmail(user.getEmail());
            existing.setPhone(user.getPhone());
            existing.setCpf(user.getCpf());
            existing.setDateBirth(user.getDateBirth());
            existing.setPassword(user.getPassword());
            return userRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
