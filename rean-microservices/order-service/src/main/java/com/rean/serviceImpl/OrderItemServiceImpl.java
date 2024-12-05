package com.rean.serviceImpl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.rean.clients.customer.CustomerClient;
import com.rean.clients.product.ProductClient;
import com.rean.dto.OrderItemRequest;
import com.rean.dto.OrderItemRespones;
import com.rean.model.OrderItem;
import com.rean.repository.OrderItemRepository;
import com.rean.service.OrderItemService;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
//@Slf4j
public class OrderItemServiceImpl implements OrderItemService{
	
	private final OrderItemRepository orderItemRepository;
    private final CustomerClient customerClient;
	private final ProductClient productClient;
	private final ModelMapper modelMapper;

	@Override
	public OrderItemRespones create(OrderItemRequest orderItemRequest) throws IOException {
		
		var customer = this.customerClient.findById(orderItemRequest.getCustomerId())
				.orElseThrow(() -> new RuntimeException("Customer not found"));

		var product = this.productClient.findById(orderItemRequest.getProductId())
				.orElseThrow(() -> new RuntimeException("Product not found"));
		
		OrderItem orderItem = new OrderItem();
			orderItem.setCustomerId(customer.getId());
	        orderItem.setProductId(product.getProductId());
	        orderItem.setOrder(orderItemRequest.getOrder());
	        orderItem.setQuantityOrder(orderItemRequest.getQuantityOrder());
	        orderItem.setTotalPrice(orderItemRequest.getTotalPrice());
	        orderItem.setCreated(LocalDateTime.now());
			
		OrderItem saveOrderItem = orderItemRepository.save(orderItem);
		OrderItemRespones respones = modelMapper.map(saveOrderItem, OrderItemRespones.class);
		respones.setCustomer(customer);
		return respones;
	}
	
	@Override
	public List<OrderItemRespones> getOrderItemsByOrderId(Integer orderId) {
		
		List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
		return orderItems.stream().map(orderItem -> {
			OrderItemRespones response = modelMapper.map(orderItem, OrderItemRespones.class);
			
			var product = this.productClient.findById(orderItem.getProductId())
					.orElseThrow(() -> new RuntimeException("Product not found"));

			var customer = this.customerClient.findById(orderItem.getCustomerId())
					.orElseThrow(() -> new RuntimeException("Customer not found"));
			
			response.setProduct(product);
			response.setCustomer(customer);
			return response;
		}).collect(Collectors.toList());
	}

	@Override
	public List<OrderItemRespones> getAll() {
		List<OrderItem> orderItems = orderItemRepository.findAll();
	    return orderItems.stream().map(orderItem -> {
	    	OrderItemRespones response = modelMapper.map(orderItem, OrderItemRespones.class);
	        response.setCustomer(customerClient.findById(orderItem.getCustomerId())
	                .orElseThrow(() -> new RuntimeException("Customer not found")));
	        response.setProduct(productClient.findById(orderItem.getProductId())
	                .orElseThrow(() -> new RuntimeException("Customer not found")));
	        return response;
	    }).collect(Collectors.toList());
	}
}
