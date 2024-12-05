package com.rean.serviceImpl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rean.clients.customer.CustomerClient;
import com.rean.dto.CategoryRequest;
import com.rean.dto.CategoryRespones;
import com.rean.model.Category;
import com.rean.model.Product;
import com.rean.repository.CategoryRepository;
import com.rean.repository.ProductRepository;
import com.rean.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepository categoryRepository;
    
    private final ProductRepository productRepository;
    
    private final CustomerClient customerClient;


    @Override
	public CategoryRespones create(CategoryRequest categoryRequest) throws IOException {
    	
		var customer = this.customerClient.findById(categoryRequest.getCustomerId())
				.orElseThrow(() -> new RuntimeException("Customer not found"));
		

		if (!"ADMIN".equals(customer.getRole())) {
			throw new RuntimeException("Only users with ADMIN role can create categories.");
		}

		Category category = Category.builder()
				.name(categoryRequest.getName())
				.customerId(categoryRequest.getCustomerId())
				.description(categoryRequest.getDescription())
				.created(LocalDateTime.now())
				.updated(LocalDateTime.now())
				.build();
		Category savedCategory = categoryRepository.save(category);
		
		return CategoryRespones.builder()
				.id(savedCategory.getId())
				.name(savedCategory.getName())
				.description(savedCategory.getDescription())
				.created(LocalDateTime.now())
				.updated(LocalDateTime.now())
				.customer(customer)
				.build();
	}


	@Override
	public CategoryRespones findById(Integer categoryId) {

		Category category = categoryRepository.findById(categoryId)
				.orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

		var customer = this.customerClient.findById(category.getCustomerId())
				.orElseThrow(() -> new RuntimeException("Customer not found with id: " + category.getCustomerId()));

		List<Product> products = category.getProduct().stream()
				.map(product -> Product.builder()
						.id(product.getId())
				        .name(product.getName())
				        .productQuantity(product.getProductQuantity())
				        .build())
				.collect(Collectors.toList());

		return CategoryRespones.builder()
				.id(category.getId())
				.name(category.getName())
				.description(category.getDescription())
				.customer(customer).products(products)
				.created(LocalDateTime.now())
				.updated(LocalDateTime.now())
				.build();
	}

	
	@Override
	public List<CategoryRespones> getAll() {
		List<Category> categories = this.categoryRepository.findAll();

		return categories.stream().map(category -> {
			
			var customer = this.customerClient.findById(category.getCustomerId())
					.orElseThrow(() -> new RuntimeException("Customer not found with id: " + category.getCustomerId()));
			
			List<Product> products = category.getProduct().stream()
					.map(product -> Product.builder()
							.id(product.getId())
					        .name(product.getName())
					        .productQuantity(product.getProductQuantity())
					        .build())
					.collect(Collectors.toList());
			
			return CategoryRespones.builder()
					.id(category.getId())
					.name(category.getName())
					.description(category.getDescription())
					.customer(customer)
					.products(products) 
					.created(category.getCreated())
					.updated(category.getUpdated())
					.build();
		}).collect(Collectors.toList());
	}

	
	@Override
    public CategoryRespones update(CategoryRequest categoryRequest, Integer categoryId) throws IOException {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        
        var customer = this.customerClient.findById(category.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!categoryRequest.getCustomerId().equals(category.getCustomerId())) {
            throw new RuntimeException("Unauthorized: Customer ID does not match the category's owner.");
        }

        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        category.setUpdated(LocalDateTime.now());

        Category updatedCategory = categoryRepository.save(category);
        return CategoryRespones.builder()
                .id(updatedCategory.getId())
                .name(updatedCategory.getName())
                .description(updatedCategory.getDescription())
                .customer(customer)
                .created(updatedCategory.getCreated())
                .updated(updatedCategory.getUpdated())
                .build();
    }


	@Override
	public void softDelete(Integer customerId, Integer categoryId) {

		Category category = categoryRepository.findById(categoryId)
				.orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

		if (!customerId.equals(category.getCustomerId())) {
			throw new RuntimeException("Unauthorized: Customer ID does not match the category's owner.");
		}

		List<Product> productList = productRepository.findAllByCategoryId(categoryId);
		for (Product product : productList) {
			product.setDeleted(true);
			productRepository.save(product);
		}
		
		category.setDeleted(true);
		categoryRepository.save(category);
	}


	@Override
	public void hardDelete(Integer customerId, Integer categoryId) {

		Category category = categoryRepository.findById(categoryId)
				.orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

		if (!customerId.equals(category.getCustomerId())) {
			throw new RuntimeException("Unauthorized: Customer ID does not match the category's owner.");
		}
		
		List<Product> productsList = productRepository.findAllByCategoryId(categoryId);
		for (Product product : productsList) {
			productRepository.delete(product);
		}
		
		categoryRepository.delete(category);
	}
	
	
	
}