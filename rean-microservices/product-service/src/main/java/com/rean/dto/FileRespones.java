package com.rean.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileRespones {

    private String name;
	
    private String uri;
    
    private String downloadUri;
    
    private Long size;
    
    private String extension;
}
