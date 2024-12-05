package com.rean.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rean.dto.OrderRequest;
import com.rean.dto.OrderRespones;
import com.rean.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {

	private final OrderService orderService;
	
	@PostMapping("")
	public ResponseEntity<?> create(@RequestBody OrderRequest orderRequest) {
		try {
			OrderRespones orderRespones = orderService.create(orderRequest);
			return ResponseEntity.ok().body(orderRespones);
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	
	@GetMapping("")
    public ResponseEntity<?> getAll() {
        try {
            List<OrderRespones> orders = orderService.getAll();
            return ResponseEntity.ok().body(orders);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
