package com.rean.service;

import java.io.IOException;
import java.util.List;

import com.rean.dto.CustomerRequest;
import com.rean.dto.CustomerResponse;

public interface CustomerService {

    CustomerResponse register(CustomerRequest customerRequest) throws IOException;
    
    CustomerResponse login(CustomerRequest customerRequest) throws IOException;
    
    CustomerResponse findById(String customerId);
    
    List<CustomerResponse> getAllCustomers();
}
