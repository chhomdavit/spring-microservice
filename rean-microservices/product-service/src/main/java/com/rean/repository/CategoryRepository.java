package com.rean.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rean.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Integer>{

}
