package com.rean.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(collection = "tbl_customers")
public class Customer {

    @Id
    private String id;
    
    @Indexed(unique = true)
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Password is required")
    private String password;

    private Boolean isVerified;

    private String verficationCode;

    private LocalDateTime verficationCodeExpiresAt;

    private int attempt;

    private String status;

    private LocalDateTime lastLogin;

    private LocalDateTime created;

    private LocalDateTime updated;
    
    private Roles role;
}
