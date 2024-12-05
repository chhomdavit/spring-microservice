package com.rean.service;

import java.io.IOException;
import java.util.List;

import com.rean.dto.CartRequest;
import com.rean.dto.CartRespones;

public interface CartService {

	CartRespones create(CartRequest cartRequest) throws IOException;
	
	CartRespones update(CartRequest cartRequest, Integer cartId) throws IOException;
	
	void delete(String customerId, Integer cartId) throws IOException;
	
	List<CartRespones> findByCustomerId(String customerId);
	
	List<CartRespones> findAll();
}
