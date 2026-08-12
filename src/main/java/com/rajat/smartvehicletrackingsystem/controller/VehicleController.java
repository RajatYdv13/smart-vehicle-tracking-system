package com.rajat.smartvehicletrackingsystem.controller;

import com.rajat.smartvehicletrackingsystem.entity.Vehicle;
import com.rajat.smartvehicletrackingsystem.service.VehicleService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import com.rajat.smartvehicletrackingsystem.dto.VehicleDto;
import jakarta.validation.Valid;

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
    public Page<Vehicle> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return  vehicleService.getAllVehicles(page, size, sortBy, sortDir);
    }
    @GetMapping("/{id}")
    public Vehicle getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id);
    }
    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id,
                                @Valid @RequestBody Vehicle vehicle) {
        return vehicleService.updateVehicle(id, vehicle);
    }
    @DeleteMapping("/{id}")
    public String deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicleById(id);
        return "Vehicle deleted successfully!";
    }
    @GetMapping("/status/{status}")
    public Page<Vehicle> getVehiclesByStatus(@PathVariable String status,
                                             @RequestParam(defaultValue = "0")  int page,
                                             @RequestParam(defaultValue = "5") int size,
                                             @RequestParam(defaultValue = "id")  String sortBy,
                                             @RequestParam(defaultValue = "asc") String sortDir) {
        return  vehicleService.getVehiclesByStatus(status, page, size, sortBy, sortDir);
    }

    @GetMapping("/owner/{ownerName}")
    public Page<Vehicle> getVehiclesByOwnerName(@PathVariable String ownerName,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "5") int size,
                                                @RequestParam(defaultValue = "id") String sortBy,
                                                @RequestParam(defaultValue = "asc") String sortDir) {
        return vehicleService.getVehiclesByOwnerName(ownerName, page, size, sortBy, sortDir);
    }
    @GetMapping("/number/{vehicleNumber}")
    public Vehicle getVehicleByVehicleNumber(@PathVariable String vehicleNumber) {
        return vehicleService.getVehicleByVehicleNumber(vehicleNumber);
    }
}
