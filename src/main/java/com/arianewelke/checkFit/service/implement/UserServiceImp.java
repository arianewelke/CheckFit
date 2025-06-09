package com.arianewelke.checkFit.service.implement;

import com.arianewelke.checkFit.entity.User;
import com.arianewelke.checkFit.repository.UserRepository;
import com.arianewelke.checkFit.service.interfaces.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImp(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
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
        User userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
            userToUpdate.setName(user.getName());
            userToUpdate.setPhone(user.getPhone());
            userToUpdate.setCpf(user.getCpf());
            userToUpdate.setDateBirth(user.getDateBirth());
            userToUpdate.setPassword(passwordEncoder.encode(user.getPassword()));
            userToUpdate.setEmail(user.getEmail());
            return userRepository.save(userToUpdate);
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<User> findByEmail(String user) {
        return List.of();
    }

    @Override
    public void deleteById(Long id) {

    }
}
