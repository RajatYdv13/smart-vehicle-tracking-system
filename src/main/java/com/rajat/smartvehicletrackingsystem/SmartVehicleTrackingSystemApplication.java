package com.rajat.smartvehicletrackingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class SmartVehicleTrackingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartVehicleTrackingSystemApplication.class, args);
    }

}
