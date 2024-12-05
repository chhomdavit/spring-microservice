package com.rean.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductRequest {
	
	@JsonProperty("productId")
	private Integer productId;
	
	@JsonProperty("name")
    private String name;

	@JsonProperty("description")
    private String description;
	
	@JsonProperty("product_image")
	private String productImage;

	@JsonProperty("productQuantity")
    private Integer productQuantity;

	@JsonProperty("price")
    private Double price;
    
	@JsonProperty("customerId")
    private String customerId;
    
	@JsonProperty("categoryId")
    private Integer categoryId;
}
