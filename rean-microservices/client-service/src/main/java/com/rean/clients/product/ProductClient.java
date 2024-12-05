package com.rean.clients.product;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@FeignClient(name = "product-service")
public interface ProductClient {

	@GetMapping("/api/v1/products/{productId}")
    Optional<ProductRespose> findById(@PathVariable("productId") Integer productId);

	@PutMapping("/api/v1/products/{productId}/product_quantity")
    void updateProductQuantity(
    		@PathVariable("productId") Integer productId, 
    		@RequestParam("productQuantity") Integer productQuantity
    		);

}
