package com.example.syncup.service;

import com.example.syncup.entity.Role;
import com.example.syncup.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    // Example method: Save a new role
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    // Example method: Get all roles
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}