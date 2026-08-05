package com.rajat.smartvehicletrackingsystem.service;

import com.rajat.smartvehicletrackingsystem.entity.Vehicle;
import com.rajat.smartvehicletrackingsystem.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleServiceImpl implements VehicleService{
    private final VehicleRepository vehicleRepository;
    public VehicleServiceImpl(VehicleRepository vehicleRepository) {

        this.vehicleRepository = vehicleRepository;
    }
    @Override
    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Override
    public Vehicle updateVehicle(Long id, Vehicle vehicle) {
        Vehicle existingVehicle = vehicleRepository.findById(id).orElse(null);
        if (existingVehicle != null) {

            existingVehicle.setVehicleNumber(vehicle.getVehicleNumber());
            existingVehicle.setOwnerName(vehicle.getOwnerName());
            existingVehicle.setDriverName(vehicle.getDriverName());
            existingVehicle.setVehicleType(vehicle.getVehicleType());
            existingVehicle.setLatitude(vehicle.getLatitude());
            existingVehicle.setLongitude(vehicle.getLongitude());
            existingVehicle.setSpeed(vehicle.getSpeed());
            existingVehicle.setStatus(vehicle.getStatus());

            return vehicleRepository.save(existingVehicle);
        }
        return null;
    }
    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    @Override
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id).orElse(null);
    }
    @Override
    public void deleteVehicleById(Long id) {
        vehicleRepository.deleteById(id);
    }
}
