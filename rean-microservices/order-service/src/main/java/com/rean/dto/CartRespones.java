package com.rean.dto;

import java.time.LocalDateTime;

import com.rean.clients.customer.CustomerRespones;
import com.rean.clients.product.ProductRespose;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CartRespones {

	 private Integer cartId; 
	
	 private Integer quantityCart;  
	 
	 private Double totalPrice;

	 private CustomerRespones customer;

	 private ProductRespose product;
	 
	 private LocalDateTime created;

	 private LocalDateTime updated;
}
