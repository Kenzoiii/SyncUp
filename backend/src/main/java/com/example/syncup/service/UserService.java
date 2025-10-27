package com.example.syncup.service;
//test
import com.example.syncup.entity.Role;
import com.example.syncup.entity.Team;
import com.example.syncup.entity.User;
import com.example.syncup.repository.RoleRepository;
import com.example.syncup.repository.TeamRepository;
import com.example.syncup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private RoleRepository roleRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    public User createUser(User user, int teamId, int roleId) {

        Team team = teamRepository.findById(teamId).orElse(null);
        Role role = roleRepository.findById(roleId).orElse(null);

        if (team == null || role == null) {
            return null;
        }

        user.setTeam(team);
        user.setRole(role);

        return userRepository.save(user);
    }

    public User updateUser(int id, User userDetails) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            return userRepository.save(user);
        }
        return null;
    }

    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }
}