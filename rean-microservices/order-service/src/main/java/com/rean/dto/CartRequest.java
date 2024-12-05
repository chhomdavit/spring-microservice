package com.rean.dto;

import lombok.Data;

@Data
public class CartRequest {

	 private Integer quantityCart;   

	 private String customerId;

	 private Integer productId;
}
