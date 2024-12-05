package com.rean.clients.customer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRespones {

    private String id;
    
    private String name;
    
    private String role;
}
