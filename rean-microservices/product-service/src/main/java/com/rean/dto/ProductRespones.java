package com.rean.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rean.clients.customer.CustomerRespones;
import com.rean.model.Category;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class ProductRespones {

	@JsonProperty("productId")
    private Integer productId;

	@JsonProperty("name")
    private String name;

	@JsonProperty("description")
    private String description;

	@JsonProperty("productQuantity")
    private Integer productQuantity;

	@JsonProperty("price")
    private Double price;
	
	@JsonProperty("product_image")
	private String productImage;
    
	@JsonProperty("customer")
    private CustomerRespones customer;
    
	@JsonProperty("category")
    private Category category;

	@JsonProperty("created")
    private LocalDateTime created;

	@JsonProperty("updated")
    private LocalDateTime updated;

}
