package com.rean.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rean.dto.OrderItemRequest;
import com.rean.dto.OrderItemRespones;
import com.rean.service.OrderItemService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders/orderItem")
public class OrderItemController {

	private final OrderItemService orderItemService;
	
	@PostMapping("")
	public ResponseEntity<?> create(@RequestBody OrderItemRequest orderItemRequest) {
		try {
			OrderItemRespones orderItemRespones = orderItemService.create(orderItemRequest);
			return ResponseEntity.ok().body(orderItemRespones);
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	@GetMapping("/{orderId}")
	public ResponseEntity<?> getOrderItemsByOrderId(@PathVariable("orderId") Integer orderId) {
		try {
			List<OrderItemRespones> orderItems = orderItemService.getOrderItemsByOrderId(orderId);
			return ResponseEntity.ok().body(orderItems);
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	@GetMapping("")
    public ResponseEntity<?> getAll() {
        try {
            List<OrderItemRespones> orderItems = orderItemService.getAll();
            return ResponseEntity.ok().body(orderItems);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
	
	
	
}
