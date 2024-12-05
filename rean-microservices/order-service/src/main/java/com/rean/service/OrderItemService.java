package com.rean.service;

import java.io.IOException;
import java.util.List;

import com.rean.dto.OrderItemRequest;
import com.rean.dto.OrderItemRespones;

public interface OrderItemService {

	OrderItemRespones create(OrderItemRequest orderItemRequest) throws IOException;
	
	List<OrderItemRespones> getOrderItemsByOrderId(Integer orderId);
	
	List<OrderItemRespones> getAll();
}
