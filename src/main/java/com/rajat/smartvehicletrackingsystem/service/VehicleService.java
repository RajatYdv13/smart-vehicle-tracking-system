package com.rajat.smartvehicletrackingsystem.service;

import com.rajat.smartvehicletrackingsystem.entity.Vehicle;
import org.springframework.data.domain.Page;


import java.util.List;

public interface VehicleService {
    Page<Vehicle> getVehiclesByStatus(String status, int page, int size, String sortBy, String sortDir);
    Page<Vehicle> getVehiclesByOwnerName(String ownerName,  int page, int size, String sortBy, String sortDir);
    Vehicle getVehicleByVehicleNumber(String vehicleNumber);
    Vehicle saveVehicle(Vehicle vehicle);
    Vehicle updateVehicle(Long id, Vehicle vehicle);
    Page<Vehicle> getAllVehicles(int page, int size, String sortBy, String sortDir);
    Vehicle getVehicleById(Long id);
    void deleteVehicleById(Long id);
}
