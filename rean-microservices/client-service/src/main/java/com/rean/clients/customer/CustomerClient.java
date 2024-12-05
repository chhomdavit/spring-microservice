package com.rean.clients.customer;

import java.util.Optional;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer-service")
public interface CustomerClient {

	@GetMapping("/api/v1/customers/{customerId}")
	Optional<CustomerRespones> findById(@PathVariable("customerId") String customerId);
}
