package com.rean.repository;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rean.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{
	
	List<Product> findAllByCategoryId(Integer categoryId);
	
	Page<Product> findAllByIsDeletedFalse(Pageable pageable);
	
	Page<Product> findAllByCategoryIdAndIsDeletedFalse(Integer categoryId, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndIsDeletedFalse(String keyword, Pageable pageable);
}
