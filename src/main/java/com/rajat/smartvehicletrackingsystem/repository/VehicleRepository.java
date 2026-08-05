package com.rajat.smartvehicletrackingsystem.repository;

import com.rajat.smartvehicletrackingsystem.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface VehicleRepository extends JpaRepository<Vehicle,Long> {

    List<Vehicle> findByStatus(String status);
    List<Vehicle> findAllByOwnerName(String ownerName);
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);


}
