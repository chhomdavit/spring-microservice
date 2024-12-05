package com.rean.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.rean.dto.ProductRespones;
import com.rean.clients.pagination.PaginationResponse;
import com.rean.dto.ProductRequest;

public interface ProductService {
 
    ProductRespones create(ProductRequest productRequest, MultipartFile file) throws IOException;
	
    ProductRespones update(ProductRequest productRequest, Integer productId, MultipartFile file) throws IOException;
    
    ProductRespones findById(Integer productId);
    
    List<ProductRespones> getAll();
    
    PaginationResponse<ProductRespones> getAll(String keyword, Integer categoryId, int pageNumber, int pageSize);

    void updateProductQuantity(Integer productId, Integer productQuantity);
}
