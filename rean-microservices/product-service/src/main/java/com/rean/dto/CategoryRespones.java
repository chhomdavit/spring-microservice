package com.rean.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.rean.clients.customer.CustomerRespones;
import com.rean.model.Product;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class CategoryRespones {

    private Integer id;

    private String name;

    private String description;
    
    private CustomerRespones customer;

    private LocalDateTime created;

    private LocalDateTime updated;

    private List<Product> products;
}
