package com.rean.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rean.dto.CategoryRequest;
import com.rean.dto.CategoryRespones;
import com.rean.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping()
	public ResponseEntity<?> create(
			@RequestBody CategoryRequest categoryRequest) {
		try {
	        CategoryRespones categoryRespones = categoryService.create(categoryRequest);
	        return ResponseEntity.ok().body(categoryRespones);
	    } catch (Exception e) {
	            Map<String, String> errorResponse = new HashMap<>();
	            errorResponse.put("error", e.getMessage());
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);   
	    }
	}
    
    @GetMapping("/{categoryId}")
	public ResponseEntity<?> findById(
			@PathVariable("categoryId") Integer categoryId) {
		return ResponseEntity.ok(this.categoryService.findById(categoryId));
	}
    
    @GetMapping()
	public ResponseEntity<List<?>> getAll() {
		List<?> customerResponses = categoryService.getAll();
		return ResponseEntity.ok().body(customerResponses);
	}
    
    @PutMapping("/{categoryId}")
    public ResponseEntity<?> update(
            @PathVariable("categoryId") Integer categoryId,
            @RequestBody CategoryRequest categoryRequest) {
        try {
            CategoryRespones categoryRespones = categoryService.update(categoryRequest, categoryId);
            return ResponseEntity.ok().body(categoryRespones);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/soft-delete/customer/{customerId}/category/{categoryId}")
	public ResponseEntity<String> softDelete(
			@PathVariable(value = "customerId") Integer customerId,
			@PathVariable(value = "categoryId") Integer categoryId) {
		try {
			categoryService.softDelete(customerId,categoryId);
			return ResponseEntity.ok("Category soft-deleted successfully");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error " + e.getMessage());
		}
	}
}
