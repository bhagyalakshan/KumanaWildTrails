package com.booking.demo.booking.dto;

public class QuickStatsDTO {
    private Integer activeDrivers;
    private Integer vehicles;
    private Integer sightings;

    public QuickStatsDTO() {}

    public QuickStatsDTO(Integer activeDrivers, Integer vehicles, Integer sightings) {
        this.activeDrivers = activeDrivers;
        this.vehicles = vehicles;
        this.sightings = sightings;
    }

    public Integer getActiveDrivers() {
        return activeDrivers;
    }

    public void setActiveDrivers(Integer activeDrivers) {
        this.activeDrivers = activeDrivers;
    }

    public Integer getVehicles() {
        return vehicles;
    }

    public void setVehicles(Integer vehicles) {
        this.vehicles = vehicles;
    }

    public Integer getSightings() {
        return sightings;
    }

    public void setSightings(Integer sightings) {
        this.sightings = sightings;
    }
}