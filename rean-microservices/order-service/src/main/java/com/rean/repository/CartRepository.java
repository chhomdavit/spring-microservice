package com.rean.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rean.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer>{

	Optional<Cart> findByCustomerIdAndProductId(String customerId, Integer productId);
	
	List<Cart> findByCustomerId(String customerId);
}
