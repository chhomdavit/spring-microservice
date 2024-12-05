package com.rean.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rean.clients.constant.AppConstants;
import com.rean.clients.pagination.PaginationResponse;
import com.rean.dto.ProductRequest;
import com.rean.dto.ProductRespones;
import com.rean.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

	@PostMapping()
	public ResponseEntity<?> create(
			@RequestParam(value = "file", required = false) MultipartFile file,
			@RequestParam("name") String name,
			@RequestParam("price") Double price,
			@RequestParam("description") String description,
			@RequestParam("productQuantity") Integer productQuantity,
			@RequestParam("categoryId") Integer categoryId,
			@RequestParam("customerId") String customerId) {
		
		ProductRequest productRequest = new ProductRequest();
		productRequest.setName(name);
		productRequest.setPrice(price);
		productRequest.setCategoryId(categoryId);
		productRequest.setCustomerId(customerId);
		productRequest.setDescription(description);
		productRequest.setProductQuantity(productQuantity);
		try {
			ProductRespones prodcutRespones = productService.create(productRequest, file);
			return ResponseEntity.ok().body(prodcutRespones);
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	@PutMapping("/{productId}")
	public ResponseEntity<?> update(
			@PathVariable ("productId") Integer productId,
			@RequestParam(value = "file", required = false) MultipartFile file,
			@RequestParam("name") String name,
			@RequestParam("price") Double price,
			@RequestParam("description") String description,
			@RequestParam("productQuantity") Integer productQuantity,
			@RequestParam("categoryId") Integer categoryId,
			@RequestParam("customerId") String customerId) {
		
		ProductRequest productRequest = new ProductRequest();
		productRequest.setName(name);
		productRequest.setPrice(price);
		productRequest.setCategoryId(categoryId);
		productRequest.setCustomerId(customerId);
		productRequest.setDescription(description);
		productRequest.setProductQuantity(productQuantity);
        
		try {
			ProductRespones prodcutRespones = productService.update(productRequest, productId, file);
			return ResponseEntity.ok().body(prodcutRespones);
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	@PutMapping("/{productId}/product_quantity")
    public ResponseEntity<?> updateProductQuantity(
            @PathVariable("productId") Integer productId,
            @RequestParam("productQuantity") Integer productQuantity) {
        try {
            productService.updateProductQuantity(productId, productQuantity);
            Map<String, String> response = new HashMap<>();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
	@GetMapping("/{productId}")
	public ResponseEntity<?> findById(@PathVariable("productId") Integer productId) {
		try {
			ProductRespones productRespones = this.productService.findById(productId);
			return ResponseEntity.ok(productRespones);
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	
	@GetMapping()
	public ResponseEntity<List<?>> getAll() {
		List<ProductRespones> productRespones = productService.getAll();
		return ResponseEntity.ok().body(productRespones);
	}
	
	@GetMapping("/product-pagination")
    public ResponseEntity<PaginationResponse<ProductRespones>> getAll(
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER) int pageNumber,
            @RequestParam(defaultValue = AppConstants.PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId) {
		
        if (keyword != null && !keyword.trim().isEmpty() && pageNumber > 0 && categoryId !=null) {
            pageNumber = 0;
        }
        PaginationResponse<ProductRespones> userResponse = productService.getAll(keyword, categoryId, pageNumber, pageSize);
        return ResponseEntity.ok().body(userResponse);
    }
	
}
