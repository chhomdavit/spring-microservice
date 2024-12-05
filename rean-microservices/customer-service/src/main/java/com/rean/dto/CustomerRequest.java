package com.rean.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CustomerRequest {

	@NotBlank(message = "Email is required")
    private String email;
    
	@NotBlank(message = "Name is required")
    private String name;

	@NotBlank(message = "Password is required")
    private String password;
}
