package com.rean.clients.pagination;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class PaginationResponse <T> {
	
	  @JsonProperty("list")
	  private List<T> list;

	  @JsonProperty("pageNumber")
	  private Integer pageNumber;
	  
	  @JsonProperty("pageSize")
	  private Integer pageSize;
	  
	  @JsonProperty("totalElements")
	  private Long totalElements;
	  
	  @JsonProperty("totalPages")
	  private int totalPages;
	  
	  @JsonProperty("isLast")
	  private  boolean isLast;
}
