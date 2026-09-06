package com.rajat.smartvehicletrackingsystem.service;

import com.rajat.smartvehicletrackingsystem.entity.Vehicle;
import com.rajat.smartvehicletrackingsystem.entity.VehicleLocation;
import com.rajat.smartvehicletrackingsystem.exception.VehicleNotFoundException;
import com.rajat.smartvehicletrackingsystem.repository.VehicleLocationRepository;
import com.rajat.smartvehicletrackingsystem.repository.VehicleRepository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class VehicleLocationServiceImpl implements VehicleLocationService {

    private final VehicleLocationRepository vehicleLocationRepository;
    private final VehicleRepository vehicleRepository;

    public VehicleLocationServiceImpl(
            VehicleLocationRepository vehicleLocationRepository,
            VehicleRepository vehicleRepository) {

        this.vehicleLocationRepository = vehicleLocationRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public VehicleLocation saveLocation(Long vehicleId, VehicleLocation location) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new VehicleNotFoundException(
                                "Vehicle Not Found with id: " + vehicleId
                        )
                );

        location.setVehicle(vehicle);

        if (location.getRecordedAt() == null) {
            location.setRecordedAt(LocalDateTime.now());
        }

        return vehicleLocationRepository.save(location);
    }

    @Override
    public List<VehicleLocation> getVehicleLocationHistory(Long vehicleId) {

        if (!vehicleRepository.existsById(vehicleId)) {
            throw new VehicleNotFoundException(
                    "Vehicle Not Found with id: " + vehicleId
            );
        }

        return vehicleLocationRepository
                .findByVehicleIdOrderByRecordedAtDesc(vehicleId);
    }

    @Override
    public VehicleLocation getLatestLocationByVehicleId(Long vehicleId) {

        if (!vehicleRepository.existsById(vehicleId)) {
            throw new VehicleNotFoundException(
                    "Vehicle Not Found with id: " + vehicleId
            );
        }

        return vehicleLocationRepository
                .findFirstByVehicleIdOrderByRecordedAtDesc(vehicleId)
                .orElseThrow(() ->
                        new VehicleNotFoundException(
                                "Location Not Found for vehicle id: " + vehicleId
                        )
                );
    }
}