package com.rean.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tbl_order")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Order {

	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id; 
	
	private String customerId;
	
	private Double subTotal = 0.0;
	
	private Double bill = 0.0;
	
	private Double discount = 0.0;
	
	private Double tax = 0.0;
	
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<OrderItem> orderItems = new ArrayList<>();
	
	@Column(name = "created", updatable = false)
	private LocalDateTime created;

	@Column(name = "updated", insertable = false)
	private LocalDateTime updated;
}
