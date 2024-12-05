package com.rean.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tbl_carts")
@JsonInclude
public class Cart {

	 @Id 
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Integer cartId; 
	
	 private Integer quantityCart;   
	 
	 private Double totalPrice;

	 private String customerId;

	 private Integer productId;
	 
	 @Column(name = "created", updatable = false)
	 private LocalDateTime created;

	 @Column(name = "updated", insertable = false)
	 private LocalDateTime updated;

}
