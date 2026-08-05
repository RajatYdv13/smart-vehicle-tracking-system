package com.rajat.smartvehicletrackingsystem.controller;

import com.rajat.smartvehicletrackingsystem.entity.Vehicle;
import com.rajat.smartvehicletrackingsystem.service.VehicleService;
import org.springframework.web.bind.annotation.*;
import com.rajat.smartvehicletrackingsystem.dto.VehicleDto;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    public final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }
    @PostMapping
    public Vehicle create(@Valid @RequestBody VehicleDto vehicleDto) {
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleNumber(vehicleDto.getVehicleNumber());
        vehicle.setOwnerName(vehicleDto.getOwnerName());
        vehicle.setDriverName(vehicleDto.getDriverName());
        vehicle.setVehicleType(vehicleDto.getVehicleType());
        vehicle.setLatitude(vehicleDto.getLatitude());
        vehicle.setLongitude(vehicleDto.getLongitude());
        vehicle.setSpeed(vehicleDto.getSpeed());
        vehicle.setStatus(vehicleDto.getStatus());

        return vehicleService.saveVehicle(vehicle);
    }
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }
    @GetMapping("/{id}")
    public Vehicle getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id);
    }
    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id,
                                 @RequestBody Vehicle vehicle) {
        return vehicleService.updateVehicle(id, vehicle);
    }
    @DeleteMapping("/{id}")
    public String deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicleById(id);
        return "Vehicle deleted successfully!";
    }
    @GetMapping("/status/{status}")
    public List<Vehicle> getVehiclesByStatus(@PathVariable String status) {
        return vehicleService.getVehiclesByStatus(status);
    }
    @GetMapping("/owner/{ownerName}")
    public List<Vehicle> getVehiclesByOwnerName(@PathVariable String ownerName) {
        return vehicleService.getVehiclesByOwnerName(ownerName);
    }
    @GetMapping("/number/{vehicleNumber}")
    public Vehicle getVehicleByVehicleNumber(@PathVariable String vehicleNumber) {
        return vehicleService.getVehicleByVehicleNumber(vehicleNumber);
    }
}
