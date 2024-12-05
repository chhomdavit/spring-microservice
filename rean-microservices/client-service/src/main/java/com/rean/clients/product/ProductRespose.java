package com.rean.clients.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductRespose {

	@JsonProperty("productId")
	private Integer productId;

	@JsonProperty("name")
    private String name;

	@JsonProperty("productQuantity")
    private Integer productQuantity;
	
	@JsonProperty("product_image")
	private String productImage;

	@JsonProperty("price")
    private Double price;
}
