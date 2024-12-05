package com.rean.service;

import java.io.IOException;
import java.util.List;

import com.rean.dto.CategoryRequest;
import com.rean.dto.CategoryRespones;

public interface CategoryService {

    CategoryRespones create(CategoryRequest categoryRequest) throws IOException;
    
    CategoryRespones update(CategoryRequest categoryRequest, Integer categoryId) throws IOException;
    
    CategoryRespones findById(Integer categoryId);
    
    List<CategoryRespones> getAll();
    
    void softDelete(Integer customerId, Integer categoryId);
	
	void hardDelete(Integer customerId, Integer categoryId);
}
