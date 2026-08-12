package com.rajat.smartvehicletrackingsystem.repository;

import com.rajat.smartvehicletrackingsystem.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface VehicleRepository extends JpaRepository<Vehicle,Long> {

    Page<Vehicle> findByStatus(String status, Pageable pageable);
    Page<Vehicle> findAllByOwnerName(
            String ownerName, Pageable pageable);
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);


}
