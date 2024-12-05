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

import com.rean.dto.CustomerRequest;
import com.rean.dto.CustomerResponse;
import com.rean.service.CustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping()
	public ResponseEntity<?> signup(@Valid @RequestBody CustomerRequest customerRequest) {
		try {
			CustomerResponse customerResponse = customerService.register(customerRequest);
			return ResponseEntity.ok().body(customerResponse);
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
    
	@GetMapping("/{customerId}")
	public ResponseEntity<?> findById(
			@PathVariable("customerId") String customerId) {
		return ResponseEntity.ok(this.customerService.findById(customerId));
	}
    
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody CustomerRequest customerRequest) {
		try {
			CustomerResponse customerResponse = customerService.login(customerRequest);
			return ResponseEntity.ok().body(customerResponse);
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "Invalid email or password.");
			errorResponse.put("error", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
    
    @GetMapping()
	public ResponseEntity<List<?>> getAllCustomers() {
		List<CustomerResponse> customerResponses = customerService.getAllCustomers();
		return ResponseEntity.ok().body(customerResponses);
	}


}
