package com.rean.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.rean.dto.NotificationRequest;
import com.rean.model.Notification;
import com.rean.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final NotificationRepository notificationRepository;
	
	public void send(NotificationRequest notificationRequest) {
		
		Notification notification = Notification.builder()
				.toCustomerId(notificationRequest.getToCustomerId())
				.toProductId(notificationRequest.getToProductId())
				.sender(notificationRequest.getSender())
				.message(notificationRequest.getMessage())
				.sentAt(LocalDateTime.now())
				.build();
		notificationRepository.save(notification);
	}
	  
}
