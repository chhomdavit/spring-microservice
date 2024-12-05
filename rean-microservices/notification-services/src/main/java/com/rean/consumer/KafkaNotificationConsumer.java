package com.rean.consumer;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import com.rean.dto.NotificationRequest;
import com.rean.service.NotificationService;

@Component
@Slf4j
@RequiredArgsConstructor
public class KafkaNotificationConsumer {
	
	private final NotificationService notificationService;

	@KafkaListener(topics = "you-notification", groupId = "notification-id", containerFactory = "customKafkaFactory")
    public void kafkaConsumer(NotificationRequest notificationRequest, Acknowledgment acknowledgment) {
        log.info("Kafka Consumed {} from queue", notificationRequest);
        notificationService.send(notificationRequest);
        acknowledgment.acknowledge();
    }
}
