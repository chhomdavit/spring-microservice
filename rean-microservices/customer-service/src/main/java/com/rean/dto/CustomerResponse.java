package com.rean.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rean.model.Roles;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomerResponse {

    private String id;

    private String email;

    private String name;

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
