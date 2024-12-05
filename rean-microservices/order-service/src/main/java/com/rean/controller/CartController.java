package com.rean.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rean.dto.CartRequest;
import com.rean.dto.CartRespones;
import com.rean.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders/cart")
public class CartController {

	private final CartService cartService;
	
	@PostMapping("")
	public ResponseEntity<?> create(@RequestBody CartRequest cartRequest) {
		try {
			CartRespones catCartRespones = cartService.create(cartRequest);
			return ResponseEntity.ok().body(catCartRespones);
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	@PutMapping("/{cartId}")
	public ResponseEntity<?> update(
			@PathVariable(value = "cartId") Integer cartId,
			@RequestBody CartRequest cartRequest){
		
		try {
			CartRespones cartRespones = cartService.update(cartRequest, cartId);
			return ResponseEntity.ok().body(cartRespones);
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	@GetMapping("/{customerId}")
	public ResponseEntity<List<CartRespones>> findByCustomerId(@PathVariable String customerId) {
		List<CartRespones> cartRespones = cartService.findByCustomerId(customerId);
		return ResponseEntity.ok(cartRespones);
	}
	
	@GetMapping("")
	public ResponseEntity<List<CartRespones>> findAll() {
		List<CartRespones> cartRespones = cartService.findAll();
		return ResponseEntity.ok(cartRespones);
	}
	
	
	@DeleteMapping("/{cartId}/customers/{customerId}")
	public ResponseEntity<Void> deleteCart(@PathVariable Integer cartId, @PathVariable String customerId) {
		try {
			cartService.delete(customerId, cartId);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
