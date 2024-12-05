package com.rean.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NotificationRequest {

    private String toCustomerId;
    
    private Integer toProductId;
    
    private String sender;
    
    private String message;
    
    private LocalDateTime sentAt;
}
