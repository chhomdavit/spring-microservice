package com.rean.service;

import java.io.IOException;
import java.util.List;

import com.rean.dto.OrderRequest;
import com.rean.dto.OrderRespones;

public interface OrderService {

	OrderRespones create(OrderRequest orderRequest) throws IOException;
	
	List<OrderRespones> getAll();
}
