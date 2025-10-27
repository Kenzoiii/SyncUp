package com.example.syncup.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "role") 
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roleId; 

    @Column(name = "role_name", length = 50)
    private String roleName; 
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
    private List<User> users; 


    public Integer getRoleId() { 
        return roleId; 
    }
    public void setRoleId(Integer roleId) { 
        this.roleId = roleId; 
    }

    public String getRoleName() { 
        return roleName; 
    }
    public void setRoleName(String roleName) { 
        this.roleName = roleName; 
    }

    public List<User> getUsers() {
        return users;
    }
    public void setUsers(List<User> users) {
        this.users = users;
    }
}
 