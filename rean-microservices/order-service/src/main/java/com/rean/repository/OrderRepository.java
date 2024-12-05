package com.rean.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rean.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>{

}
