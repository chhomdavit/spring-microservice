package com.rean.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rean.dto.NotificationRequest;
import com.rean.service.NotificationService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/notification")
@AllArgsConstructor
@Slf4j
public class NotificationController {
	
	private final NotificationService notificationService;
	
	@PostMapping()
    public void sendNotification(@RequestBody NotificationRequest notificationRequest) {
        log.info("New notification... {}", notificationRequest);
        notificationService.send(notificationRequest);
    }

	@GetMapping("/hello")
	public Map<String, String> helloWorld() {
		return Collections.singletonMap("message", "Hello World");
	}
}
