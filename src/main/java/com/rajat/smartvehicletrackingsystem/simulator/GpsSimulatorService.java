package com.rajat.smartvehicletrackingsystem.simulator;
import com.rajat.smartvehicletrackingsystem.entity.Vehicle;
import com.rajat.smartvehicletrackingsystem.entity.VehicleLocation;
import com.rajat.smartvehicletrackingsystem.repository.VehicleRepository;
import com.rajat.smartvehicletrackingsystem.service.VehicleLocationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
@Service
public class GpsSimulatorService {
    private final VehicleLocationService vehicleLocationService;
    private final VehicleRepository vehicleRepository;
    // Store every vehicle's simulated GPS position
    private final Map<Long, double[]> vehiclePositions = new HashMap<>();
    public GpsSimulatorService(
            VehicleLocationService vehicleLocationService,
            VehicleRepository vehicleRepository) {
        this.vehicleLocationService = vehicleLocationService;
        this.vehicleRepository = vehicleRepository;
    }
    // ======================================================
    // GPS SIMULATOR
    // Runs every 10 seconds
    // ======================================================
    @Scheduled(fixedRate = 10000)
    public void generateGpsLocations() {
        try {
            // Get ALL vehicles from database
            Iterable<Vehicle> vehicles =
                    vehicleRepository.findAll();
            for (Vehicle vehicle : vehicles) {
                Long vehicleId =
                        vehicle.getId();
                if (vehicleId == null) {
                    continue;
                }
                // ==================================================
                // CREATE INITIAL LOCATION FOR NEW VEHICLE
                // ==================================================
                if (!vehiclePositions.containsKey(vehicleId)) {
                    double baseLatitude =
                            25.5941 +
                                    ((vehicleId % 20) * 0.002);
                    double baseLongitude =
                            85.1376 +
                                    ((vehicleId % 20) * 0.002);
                    vehiclePositions.put(
                            vehicleId,
                            new double[]{
                                    baseLatitude,
                                    baseLongitude
                            }
                    );
                }
                // ==================================================
                // GET CURRENT POSITION
                // ==================================================
                double[] position =
                        vehiclePositions.get(vehicleId);
                double latitude =
                        position[0];
                double longitude =
                        position[1];
                // ==================================================
                // GENERATE SPEED
                // ==================================================
                double speed =
                        30 +
                                ((vehicleId * 7) % 25);
                // ==================================================
                // SAVE GPS LOCATION
                // ==================================================
                saveVehicleLocation(
                        vehicleId,
                        latitude,
                        longitude,
                        speed
                );
                // ==================================================
                // MOVE VEHICLE
                // ==================================================
                double latitudeIncrement =
                        0.0003 +
                                ((vehicleId % 5) * 0.0001);
                double longitudeIncrement =
                        0.0003 +
                                ((vehicleId % 4) * 0.0001);
                position[0] +=
                        latitudeIncrement;
                position[1] +=
                        longitudeIncrement;
            }
        } catch (Exception e) {
            System.err.println(
                    "GPS Simulator Error: " +
                            e.getMessage()
            );
        }
    }
    // ======================================================
    // SAVE LOCATION
    // ======================================================
    private void saveVehicleLocation(
            Long vehicleId,
            double latitude,
            double longitude,
            double speed) {
        try {
            VehicleLocation location =
                    new VehicleLocation();
            location.setLatitude(
                    latitude
            );
            location.setLongitude(
                    longitude
            );
            location.setSpeed(
                    speed
            );
            vehicleLocationService.saveLocation(
                    vehicleId,
                    location
            );
            System.out.println(
                    "GPS Updated → Vehicle ID: " +
                            vehicleId +
                            " | Latitude: " +
                            latitude +
                            " | Longitude: " +
                            longitude +
                            " | Speed: " +
                            speed
            );
        } catch (Exception e) {
            System.err.println(
                    "Unable to save GPS for Vehicle " +
                            vehicleId +
                            ": " +
                            e.getMessage()
            );
        }
    }
}