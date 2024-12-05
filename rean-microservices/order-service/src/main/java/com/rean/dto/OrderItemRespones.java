package com.rean.dto;

import java.time.LocalDateTime;

import com.rean.clients.customer.CustomerRespones;
import com.rean.clients.product.ProductRespose;

import lombok.Data;

@Data
public class OrderItemRespones {

    private Integer id;
    
    private CustomerRespones customer;
    
    private ProductRespose product;
    
    private Integer quantityOrder;
    
    private Double totalPrice;
    
	private LocalDateTime created;

	private LocalDateTime updated;
}
