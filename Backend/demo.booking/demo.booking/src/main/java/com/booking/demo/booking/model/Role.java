package com.booking.demo.booking.model;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

public enum Role {
    ADMIN,
    DRIVER,
    CUSTOMER;

    public SimpleGrantedAuthority toAuthority() {
        return new SimpleGrantedAuthority("ROLE_" + this.name());
    }
}