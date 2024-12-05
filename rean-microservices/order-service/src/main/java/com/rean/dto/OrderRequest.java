package com.rean.dto;

import java.util.ArrayList;
import java.util.List;

import com.rean.model.OrderItem;

import lombok.Data;

@Data
public class OrderRequest {

    private String customerId;
	
	private Double subTotal = 0.0;
	
	private Double bill = 0.0;
	
	private Double discount = 0.0;
	
	private Double tax = 0.0;
	
    private List<OrderItem> orderItems = new ArrayList<>();
}
