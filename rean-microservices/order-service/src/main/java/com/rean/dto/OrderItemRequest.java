package com.rean.dto;


import com.rean.model.Order;

import lombok.Data;

@Data
public class OrderItemRequest {

	private Order order;
    
    private String customerId;
    
    private Integer productId;
    
    private Integer quantityOrder;
    
    private Double totalPrice;
    
}
