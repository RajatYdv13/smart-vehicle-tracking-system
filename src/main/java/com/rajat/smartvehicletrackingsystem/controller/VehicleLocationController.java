package com.rajat.smartvehicletrackingsystem.controller;

import com.rajat.smartvehicletrackingsystem.entity.VehicleLocation;
import com.rajat.smartvehicletrackingsystem.service.VehicleLocationService;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleLocationController {

    private final VehicleLocationService vehicleLocationService;

    public VehicleLocationController(VehicleLocationService vehicleLocationService) {
        this.vehicleLocationService = vehicleLocationService;
    }
    @PostMapping("/{vehicleId}/locations")
    public VehicleLocation saveLocation(
            @PathVariable Long vehicleId,
            @RequestBody VehicleLocation location){
        return vehicleLocationService.saveLocation(vehicleId, location);
    }
    @GetMapping("/{vehicleId}/locations")
    public List<VehicleLocation> getLocationsHistory(
            @PathVariable Long vehicleId){
        return vehicleLocationService.getVehicleLocationHistory(vehicleId);
    }
    @GetMapping("/{vehicleId}/locations/latest")
    public VehicleLocation getLatestLocation(
            @PathVariable Long vehicleId){
        return vehicleLocationService.getLatestLocationByVehicleId(vehicleId);
    }
}