package com.rean.repository;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.rean.model.Customer;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
	
    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByName(String name);

}
