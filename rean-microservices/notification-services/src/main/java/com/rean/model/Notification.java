package com.rean.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "tbl_notification")
public class Notification {

	@Id
    private String notificationId;
	
    private String toCustomerId;
    
    private Integer toProductId;
    
    private String sender;
    
    private String message;
    
    private LocalDateTime sentAt;
}
