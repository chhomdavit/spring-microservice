package com.rean.serviceImpl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.rean.clients.notification.NotificationClient;
import com.rean.clients.notification.NotificationRequest;
import com.rean.dto.CustomerRequest;
import com.rean.dto.CustomerResponse;
import com.rean.model.Customer;
import com.rean.model.Roles;
import com.rean.repository.CustomerRepository;
import com.rean.service.CustomerService;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService{
    
    private final CustomerRepository customerRepository;
    
    private final NotificationClient notificationClient;
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    private static final String TOPIC_NAME = "notification";

    @Override
    public CustomerResponse register(CustomerRequest customerRequest) throws IOException {
    	
        Customer customer = Customer.builder()
        .name(customerRequest.getName())
        .email(customerRequest.getEmail())
        .password(customerRequest.getPassword())
        .isVerified(false)
        .role(Roles.USER)
        .status("ACTIVE")
		.attempt(0)
		.verficationCode(generateOTP())
		.verficationCodeExpiresAt(LocalDateTime.now().plusHours(1))
		.created(LocalDateTime.now())
		.updated(LocalDateTime.now())
        .build();
        Customer savedCustomer =customerRepository.save(customer);
        
		NotificationRequest notificationRequest = new NotificationRequest(
				customer.getId(), 
				"Com.Rean",
				String.format("Hi %s, welcome to Com.Rean...", customer.getName()));
		notificationClient.sendNotification(notificationRequest);
		kafkaTemplate.send(TOPIC_NAME, notificationRequest);
       
        CustomerResponse response = CustomerResponse.builder()
		.id(savedCustomer.getId())
        .name(savedCustomer.getName())
		.email(savedCustomer.getEmail())
		.password(savedCustomer.getPassword())
		.role(Roles.USER)
		.isVerified(false)
		.status("ACTIVE")
		.attempt(0)
		.verficationCode(generateOTP())
		.verficationCodeExpiresAt(LocalDateTime.now().plusHours(1))
		.created(LocalDateTime.now())
		.updated(LocalDateTime.now())
        .build();
        return response;
    }

    private String generateOTP() {
		Random random = new Random();
		int otpValue = 100000 + random.nextInt(900000);
		return String.valueOf(otpValue);
	}

	@Override
	public CustomerResponse findById(String customerId) {
		Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + customerId));
		
		return CustomerResponse.builder()
				.id(customer.getId())
	            .email(customer.getEmail())
	            .name(customer.getName())
	            .isVerified(customer.getIsVerified())
	            .verficationCode(customer.getVerficationCode())
	            .verficationCodeExpiresAt(customer.getVerficationCodeExpiresAt())
	            .attempt(customer.getAttempt())
	            .status(customer.getStatus())
	            .lastLogin(customer.getLastLogin())
	            .created(customer.getCreated())
	            .updated(customer.getUpdated())
	            .role(customer.getRole())
	            .build();
	}

	@Override
	public List<CustomerResponse> getAllCustomers() {
		 List<Customer> customers = customerRepository.findAll();
		    return customers.stream().map(customer -> 
		        CustomerResponse.builder()
		            .id(customer.getId())
		            .email(customer.getEmail())
		            .name(customer.getName())
		            .isVerified(customer.getIsVerified())
		            .verficationCode(customer.getVerficationCode())
		            .verficationCodeExpiresAt(customer.getVerficationCodeExpiresAt())
		            .attempt(customer.getAttempt())
		            .status(customer.getStatus())
		            .lastLogin(customer.getLastLogin())
		            .created(customer.getCreated())
		            .updated(customer.getUpdated())
		            .role(customer.getRole())
		            .build()
		    ).collect(Collectors.toList());
	}

	@Override
	public CustomerResponse login(CustomerRequest customerRequest) throws IOException {
		
		Customer customers= customerRepository.findByEmail(customerRequest.getEmail())
				.orElseThrow(() -> new RuntimeException("Invalid email or password"));

		if ("LOCKED".equals(customers.getStatus()) && customers.getLastLogin() != null) {
			LocalDateTime lockedUntil = customers.getLastLogin().plusMinutes(1);
			if (LocalDateTime.now().isBefore(lockedUntil)) {
				throw new RuntimeException("Account is locked. Please try again after 1 minute.");
			} else {
				customers.setStatus("ACTIVE");
				customers.setAttempt(0);
			}
		}

		try {
			if (!customerRequest.getPassword().equals(customers.getPassword())) {
				int attempts = customers.getAttempt() + 1;
				customers.setAttempt(attempts);

				if (attempts >= 3) {
					customers.setStatus("LOCKED");
					customers.setLastLogin(LocalDateTime.now());
				}

				customerRepository.save(customers);
				throw new RuntimeException("Invalid email or password. Attempt " + attempts + " of 3.");
			}
			customers.setLastLogin(LocalDateTime.now());
			customers.setAttempt(0);
			customerRepository.save(customers);
			
			return CustomerResponse.builder()
					.id(customers.getId())
					.email(customers.getEmail())
					.name(customers.getName())
					.role(customers.getRole())
					.lastLogin(customers.getLastLogin())
					.build();
		} catch (Exception e) {
			int attempts = customers.getAttempt() + 1;
			customers.setAttempt(attempts);
			if (attempts >= 3) {
				customers.setStatus("LOCKED");
				customers.setLastLogin(LocalDateTime.now());
			}
			customerRepository.save(customers);
			throw new RuntimeException("Invalid email or password. Attempt " + attempts + " of 3.");
		}
	}	
}
