package com.rean;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@EnableEurekaServer
@SpringBootApplication
public class DiscoveryEureKaApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryEureKaApplication.class, args);
    }
}