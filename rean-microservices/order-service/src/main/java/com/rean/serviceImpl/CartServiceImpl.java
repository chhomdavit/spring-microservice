package com.rean.serviceImpl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.rean.clients.customer.CustomerClient;
import com.rean.clients.product.ProductClient;
import com.rean.dto.CartRequest;
import com.rean.dto.CartRespones;
import com.rean.model.Cart;
import com.rean.repository.CartRepository;
import com.rean.service.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService{
	
	private final CartRepository cartRepository;
	private final CustomerClient customerClient;
	private final ProductClient productClient;
	private final ModelMapper modelMapper;

	@Override
	public CartRespones create(CartRequest cartRequest) throws IOException {

		var customer = this.customerClient.findById(cartRequest.getCustomerId())
				.orElseThrow(() -> new RuntimeException("Customer not found"));

		var product = this.productClient.findById(cartRequest.getProductId())
				.orElseThrow(() -> new RuntimeException("Product not found"));

		Optional<Cart> existingCart = cartRepository
				.findByCustomerIdAndProductId(customer.getId(), product.getProductId());

		Cart cart;
	    if (existingCart.isPresent()) {
	        cart = existingCart.get();
	        cart.setQuantityCart(cart.getQuantityCart() + cartRequest.getQuantityCart());
	    } else {
	        cart = new Cart();
	        cart.setCustomerId(customer.getId());
	        cart.setProductId(product.getProductId());
	        cart.setQuantityCart(cartRequest.getQuantityCart());
	        cart.setCreated(LocalDateTime.now());
	    }
	    cart.setTotalPrice(cart.getQuantityCart() * product.getPrice());

		cartRepository.saveAndFlush(cart);
		CartRespones cartRespones = modelMapper.map(cart, CartRespones.class);
		cartRespones.setCustomer(customer);
		cartRespones.setProduct(product);

		log.info("cartRespones saved successfully {}", cartRespones);
		return cartRespones;
	}

	@Override
	public List<CartRespones> findByCustomerId(String customerId) {

		List<Cart> carts = cartRepository.findByCustomerId(customerId);
		return carts.stream().map(cart -> {
			CartRespones response = modelMapper.map(cart, CartRespones.class);
			
			var product = this.productClient.findById(cart.getProductId())
					.orElseThrow(() -> new RuntimeException("Product not found"));

			var customer = this.customerClient.findById(cart.getCustomerId())
					.orElseThrow(() -> new RuntimeException("Customer not found"));
			
			response.setProduct(product);
			response.setCustomer(customer);
			return response;
		}).collect(Collectors.toList());
	}

	@Override
	public List<CartRespones> findAll() {
		List<Cart> carts = cartRepository.findAll();
		return carts.stream().map(cart -> {
			CartRespones response = modelMapper.map(cart, CartRespones.class);
			
			var product = this.productClient.findById(cart.getProductId())
					.orElseThrow(() -> new RuntimeException("Product not found"));

			var customer = this.customerClient.findById(cart.getCustomerId())
					.orElseThrow(() -> new RuntimeException("Customer not found"));
			
			response.setProduct(product);
			response.setCustomer(customer);
			return response;
		}).collect(Collectors.toList());
	}

	@Override
	public CartRespones update(CartRequest cartRequest, Integer cartId) throws IOException {

		Cart cart = this.cartRepository.findById(cartId)
				.orElseThrow(() -> new RuntimeException("Cart not found"));

		var customer = this.customerClient.findById(cartRequest.getCustomerId())
				.orElseThrow(() -> new RuntimeException("Customer not found"));

		var product = this.productClient.findById(cartRequest.getProductId())
				.orElseThrow(() -> new RuntimeException("Product not found"));
		
		if (!cart.getCustomerId().equals(cartRequest.getCustomerId())) {
	        throw new RuntimeException("Unauthorized: Customer ID does not match the cart's owner");
	    }
		
		if (!cart.getProductId().equals(cartRequest.getProductId())) {
	        throw new RuntimeException("Unauthorized: Product ID does not match the cart's owner");
	    }

		cart.setQuantityCart(cartRequest.getQuantityCart());
		cart.setCustomerId(customer.getId());
		cart.setProductId(product.getProductId());
		cart.setTotalPrice(cart.getQuantityCart() * product.getPrice());
		cart.setUpdated(LocalDateTime.now());
        
		Cart cartSaved = cartRepository.save(cart);
		CartRespones response = modelMapper.map(cartSaved, CartRespones.class);
		response.setCustomer(customer);
		response.setProduct(product);
        return response;
	}

	@Override
	public void delete(String customerId, Integer cartId) throws IOException {
		
		Cart cart = this.cartRepository.findById(cartId)
				.orElseThrow(() -> new RuntimeException("Cart not found"));
		
		var customer = this.customerClient.findById(customerId)
				.orElseThrow(() -> new RuntimeException("Customer not found"));
		
		if (!customer.getId().equals(customer.getId())) {
            throw new RuntimeException("Customer not authorized to delete this cart");
        }
		cartRepository.delete(cart);
	}
	
}
