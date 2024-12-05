package com.rean.clients.product;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {

	@JsonProperty("productId")
	private Integer productId;

	@JsonProperty("productQuantity")
    private Integer productQuantity;
}
