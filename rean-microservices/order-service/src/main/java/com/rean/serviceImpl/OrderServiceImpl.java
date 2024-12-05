package com.rean.serviceImpl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.rean.clients.customer.CustomerClient;
import com.rean.clients.product.ProductClient;
import com.rean.clients.product.ProductRespose;
import com.rean.dto.OrderRequest;
import com.rean.dto.OrderRespones;
import com.rean.model.Cart;
import com.rean.model.Order;
import com.rean.model.OrderItem;
import com.rean.repository.CartRepository;
import com.rean.repository.OrderRepository;
import com.rean.service.OrderService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{

	private final OrderRepository orderRepository;
	private final CartRepository cartRepository;
	private final ModelMapper modelMapper;
	private final CustomerClient customerClient;
	private final ProductClient productClient;


	@Override
    public OrderRespones create(OrderRequest orderRequest) throws IOException {

        var customer = this.customerClient.findById(orderRequest.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Cart> customerCart = cartRepository.findByCustomerId(orderRequest.getCustomerId());
        if (customerCart.isEmpty()) {
            throw new RuntimeException("Cart is empty for the customer");
        }

        Order order = new Order();
        order.setCustomerId(orderRequest.getCustomerId());
        order.setDiscount(orderRequest.getDiscount());
        order.setTax(orderRequest.getTax());
        order.setSubTotal(orderRequest.getSubTotal());
        order.setBill(orderRequest.getBill());

        List<OrderItem> orderItems = customerCart.stream().map(cart -> {
            ProductRespose productRespose = productClient.findById(cart.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            if (productRespose.getProductQuantity() < cart.getQuantityCart()) {
                throw new RuntimeException("Insufficient stock for product ID: " + productRespose.getProductId());
            }
            productRespose.setProductQuantity(productRespose.getProductQuantity() - cart.getQuantityCart());
            productClient.updateProductQuantity(productRespose.getProductId(),productRespose.getProductQuantity());

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(cart.getProductId());
            orderItem.setCustomerId(cart.getCustomerId());
            orderItem.setCreated(LocalDateTime.now());
            orderItem.setQuantityOrder(cart.getQuantityCart());
            orderItem.setTotalPrice(cart.getTotalPrice());
            return orderItem;
        }).collect(Collectors.toList());
        order.setOrderItems(orderItems);
        order.setCreated(LocalDateTime.now());
      
        Order savedOrder = orderRepository.save(order);
        cartRepository.deleteAll(customerCart);
        OrderRespones response = modelMapper.map(savedOrder, OrderRespones.class);
        response.setCustomer(customer);
        return response;
    }


	@Override
	public List<OrderRespones> getAll() {
	    List<Order> orders = orderRepository.findAll();
	    return orders.stream().map(order -> {
	        OrderRespones response = modelMapper.map(order, OrderRespones.class);
	        response.setCustomer(customerClient.findById(order.getCustomerId())
	                .orElseThrow(() -> new RuntimeException("Customer not found")));
	        return response;
	    }).collect(Collectors.toList());
	}
}
