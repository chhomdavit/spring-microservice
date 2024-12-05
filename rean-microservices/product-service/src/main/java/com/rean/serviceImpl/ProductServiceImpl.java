package com.rean.serviceImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.rean.clients.customer.CustomerClient;
import com.rean.clients.pagination.PaginationResponse;
import com.rean.dto.FileRespones;
import com.rean.dto.ProductRequest;
import com.rean.dto.ProductRespones;
import com.rean.model.Category;
import com.rean.model.Product;
import com.rean.repository.CategoryRepository;
import com.rean.repository.ProductRepository;
import com.rean.service.FileUploadService;
import com.rean.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl  implements ProductService{

    private final ProductRepository productRepository;
    
    private final CategoryRepository categoryRepository;
    
    private final CustomerClient customerClient;
    
    private final FileUploadService fileUploadService;
    
    @Value("${project.upload}")
    private String path;
 


	@Override
	public ProductRespones create(ProductRequest productRequest, MultipartFile file) throws IOException {
	    
		Category category = this.categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Catgoery not found"));
		
		var customer = this.customerClient.findById(productRequest.getCustomerId())
				.orElseThrow(() -> new RuntimeException("Customer not found"));
		
		String newFileUri = null;
	    if (file != null && !file.isEmpty()) {
	        FileRespones fileResponse = fileUploadService.uploadSingle(file, path);
	        newFileUri = fileResponse.getName();
	        productRequest.setProductImage(newFileUri);
	    }
		
		Product product = Product.builder()
				.name(productRequest.getName())
				.description(productRequest.getDescription())
				.productQuantity(productRequest.getProductQuantity())
				.price(productRequest.getPrice())
				.productImage(newFileUri)
				.customerId(productRequest.getCustomerId())
				.category(category)
				.created(LocalDateTime.now())
				.build();
		Product saveProduct = productRepository.save(product);
		
		return ProductRespones.builder()
				.productId(saveProduct.getId())
				.name(saveProduct.getName())
				.description(saveProduct.getDescription())
				.productQuantity(saveProduct.getProductQuantity())
				.productImage(saveProduct.getProductImage())
				.price(saveProduct.getPrice())
				.customer(customer)
				.category(Category.builder()
						.id(category.getId())
						.name(category.getName())
						.build())
				.created(saveProduct.getCreated())
				.build();
	}

	@Override
	public ProductRespones findById(Integer productId) {
		
		Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
		
		 var customer = this.customerClient.findById(product.getCustomerId())
		            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + product.getCustomerId()));
		 
		 Category category = this.categoryRepository.findById(product.getCategory().getId())
		            .orElseThrow(() -> new RuntimeException("Category not found with id: " + product.getCategory().getId()));
			 
		return ProductRespones.builder()
				.productId(product.getId())
				.name(product.getName())
				.description(product.getDescription())
				.productQuantity(product.getProductQuantity())
				.productImage(product.getProductImage())
				.price(product.getPrice())
				.customer(customer)
				.category(Category.builder()
						.id(category.getId())
						.name(category.getName())
						.build())
				.created(LocalDateTime.now())
				.updated(LocalDateTime.now())
				.build();	
	}

	@Override
	public List<ProductRespones> getAll() {
		List<Product> products = productRepository.findAll();

		return products.stream().map(product -> {
			
			Category category = this.categoryRepository.findById(product.getCategory().getId())
			            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + product.getCategory().getId()));
			
			var customer = this.customerClient.findById(product.getCustomerId())
					.orElseThrow(() -> new RuntimeException("Customer not found with id: " + product.getCustomerId()));

			return ProductRespones.builder()
					.productId(product.getId())
					.name(product.getName())
					.description(product.getDescription())
					.productQuantity(product.getProductQuantity())
					.price(product.getPrice())
					.customer(customer)
					.category(Category.builder()
							.id(category.getId())
							.name(category.getName())
							.build())
					.created(product.getCreated())
					.updated(product.getUpdated())
					.build();
		}).collect(Collectors.toList());
	}

	@Override
	public ProductRespones update(ProductRequest productRequest, Integer productId, MultipartFile file) throws IOException {
		
		Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
		
		Category category = this.categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Catgoery not found"));
		
		var customer = this.customerClient.findById(productRequest.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

		if (!productRequest.getCustomerId().equals(product.getCustomerId())) {
            throw new RuntimeException("Unauthorized: Customer ID does not match the category's owner.");
        }
		
		String newFileUri = product.getProductImage();  
	    try {
	        if (file != null && !file.isEmpty()) {
	            if (product.getProductImage() != null && !product.getProductImage().isEmpty()) {
	                Files.deleteIfExists(Paths.get(path, product.getProductImage()));
	            }
	            FileRespones fileResponse = fileUploadService.uploadSingle(file, path);
	            newFileUri = fileResponse.getName();  
	        }
	    } catch (IOException e) {
	        throw new RuntimeException("Error occurred while uploading new image for post", e);
	    }
	
	    product.setProductImage(newFileUri);
		product.setName(productRequest.getName());
		product.setProductQuantity(productRequest.getProductQuantity());
		product.setDescription(productRequest.getDescription());
		product.setPrice(productRequest.getPrice());
		product.setCategory(category);
		product.setUpdated(LocalDateTime.now());
		
		Product updatedProduct = productRepository.save(product);
		
		return ProductRespones.builder()
				.productId(updatedProduct.getId())
				.name(updatedProduct.getName())
				.productImage(updatedProduct.getProductImage())
				.description(updatedProduct.getDescription())
				.productQuantity(updatedProduct.getProductQuantity())
				.price(updatedProduct.getPrice())
				.customer(customer)
				.category(Category.builder()
						.id(category.getId())
						.name(category.getName())
						.build())
				.created(updatedProduct.getCreated())
                .updated(updatedProduct.getUpdated())
				.build();
	}

	@Override
	public void updateProductQuantity(Integer productId, Integer productQuantity) {
		
		 Product product = productRepository.findById(productId)
		            .orElseThrow(() -> new RuntimeException("Product not found"));
		 
		    product.setProductQuantity(productQuantity);
		    product.setUpdated(LocalDateTime.now());
		    productRepository.save(product);
	}

	@Override
	public PaginationResponse<ProductRespones> getAll(String keyword, Integer categoryId, int pageNumber, int pageSize) {
		
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
	    Page<Product> productPages;
	    
		    if (categoryId != null) {
		        productPages = productRepository.findAllByCategoryIdAndIsDeletedFalse(categoryId, pageable);
		        
		    } else if (keyword != null && !keyword.trim().isEmpty()) {
		        productPages = productRepository.findByNameContainingIgnoreCaseAndIsDeletedFalse(keyword, pageable);
		        
		    } else {
		        productPages = productRepository.findAllByIsDeletedFalse(pageable);
		        
		    }
		    
	    List<ProductRespones> responseList = productPages.getContent().stream().map(product -> {
	    	
	                Category category = categoryRepository.findById(product.getCategory().getId())
	                        .orElseThrow(() -> new RuntimeException("Category not found with id: " + product.getCategory().getId()));

	                var customer = customerClient.findById(product.getCustomerId())
	                        .orElseThrow(() -> new RuntimeException("Customer not found with id: " + product.getCustomerId()));

	                return ProductRespones.builder()
	                		.productId(product.getId())
	    					.name(product.getName())
	    					.description(product.getDescription())
	    					.productQuantity(product.getProductQuantity())
	    					.productImage(product.getProductImage())
	    					.price(product.getPrice())
	    					.customer(customer)
	    					.category(Category.builder()
	    							.id(category.getId())
	    							.name(category.getName())
	    							.build())
	    					.created(product.getCreated())
	    					.updated(product.getUpdated())
	    					.build();
	            })
	            .collect(Collectors.toList());

	    PaginationResponse<ProductRespones> paginationResponse = new PaginationResponse<>();
		paginationResponse.setList(responseList);
		paginationResponse.setPageNumber(productPages.getNumber());
		paginationResponse.setPageSize(productPages.getSize());
		paginationResponse.setTotalElements(productPages.getTotalElements());
		paginationResponse.setTotalPages(productPages.getTotalPages());
		paginationResponse.setLast(productPages.isLast());

		return paginationResponse;
	}

}
