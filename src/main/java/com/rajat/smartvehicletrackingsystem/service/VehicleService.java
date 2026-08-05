package com.rajat.smartvehicletrackingsystem.service;

import com.rajat.smartvehicletrackingsystem.entity.Vehicle;

import java.util.List;

public interface VehicleService {
    List<Vehicle> getVehiclesByStatus(String status);
    List<Vehicle> getVehiclesByOwnerName(String ownerName);
    Vehicle getVehicleByVehicleNumber(String vehicleNumber);
    Vehicle saveVehicle(Vehicle vehicle);
    Vehicle updateVehicle(Long id, Vehicle vehicle);
    List<Vehicle> getAllVehicles();
    Vehicle getVehicleById(Long id);
    void deleteVehicleById(Long id);
}
