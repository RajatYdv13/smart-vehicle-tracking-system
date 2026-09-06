package com.rajat.smartvehicletrackingsystem.service;

import com.rajat.smartvehicletrackingsystem.entity.VehicleLocation;

import java.util.List;

public interface VehicleLocationService {
    VehicleLocation saveLocation(Long vehicleId, VehicleLocation location);
    List<VehicleLocation> getVehicleLocationHistory(Long vehicleId);
    VehicleLocation getLatestLocationByVehicleId(Long vehicleId);
}
