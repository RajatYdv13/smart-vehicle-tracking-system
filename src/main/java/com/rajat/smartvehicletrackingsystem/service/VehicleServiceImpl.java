package com.rajat.smartvehicletrackingsystem.service;

import com.rajat.smartvehicletrackingsystem.entity.Vehicle;
import com.rajat.smartvehicletrackingsystem.exception.VehicleNotFoundException;
import com.rajat.smartvehicletrackingsystem.repository.VehicleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        Vehicle existingVehicle = vehicleRepository.findById(id).orElseThrow(() ->
                new VehicleNotFoundException("Vehicle not found with id " + id));

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
    @Override
    public Page<Vehicle> getAllVehicles(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ?Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return vehicleRepository.findAll(pageable);
    }
    @Override
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id).orElseThrow(() ->
        new VehicleNotFoundException("vehicle not found with id " + id));
    }
    @Override
    public void deleteVehicleById(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new VehicleNotFoundException("vehicle not found with id " + id);
        }
        vehicleRepository.deleteById(id);
    }
    @Override
    public Page<Vehicle> getVehiclesByStatus(
            String status,
            int page,
            int size,
            String sortBy,
            String sortDir
    ){
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ?Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return vehicleRepository.findByStatus(status, pageable);
    }
    @Override
    public Page<Vehicle> getVehiclesByOwnerName(String ownerName, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ?Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return vehicleRepository.findAllByOwnerName(ownerName, pageable);
    }
    @Override
    public Vehicle getVehicleByVehicleNumber(String vehicleNumber) {
        return vehicleRepository.findByVehicleNumber(vehicleNumber)
                .orElseThrow(() ->
                        new VehicleNotFoundException("Vehicle not found with vehicle number " + vehicleNumber));
    }
}
