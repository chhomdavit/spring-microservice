package com.rean.service;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.rean.dto.FileRespones;


public interface FileUploadService {

    byte[] getFileName(String fileName);
	
	List<FileRespones> findAll();

    String saveBase64Image(String path, byte[] base64Image) throws IOException;
    
    FileRespones uploadSingle(MultipartFile file, String path) throws IOException;

    List<FileRespones> uploadMultiple(List<MultipartFile> files, String path) throws IOException;
    
    void deleteAll();

    void deleteByName(String fileName);
    
    Resource downloadByName(String fileName);
}
