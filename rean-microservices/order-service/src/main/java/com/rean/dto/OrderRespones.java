package com.rean.dto;

import java.time.LocalDateTime;
import com.rean.clients.customer.CustomerRespones;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
public class OrderRespones {

	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id; 
	
	private CustomerRespones customer;
	
	private Double subTotal = 0.0;
	
	private Double bill = 0.0;
	
	private Double discount = 0.0;
	
	private Double tax = 0.0;
	
	private LocalDateTime created;

	private LocalDateTime updated;
}
