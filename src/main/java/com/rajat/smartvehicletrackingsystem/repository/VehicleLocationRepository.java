package com.rajat.smartvehicletrackingsystem.repository;

import com.rajat.smartvehicletrackingsystem.entity.VehicleLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleLocationRepository  extends JpaRepository<VehicleLocation, Long> {

    List<VehicleLocation> findByVehicleIdOrderByRecordedAtDesc(Long vehicleId);
    Optional<VehicleLocation> findFirstByVehicleIdOrderByRecordedAtDesc(Long vehicleId);
}
