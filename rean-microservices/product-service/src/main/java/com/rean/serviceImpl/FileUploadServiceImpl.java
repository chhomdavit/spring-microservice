package com.rean.serviceImpl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.rean.dto.FileRespones;
import com.rean.service.FileUploadService;


@Service
public class FileUploadServiceImpl implements FileUploadService {

	@Value("${project.upload}")
	private String path;

	@Value("${base.url}")
	private String baseUrl;

	private FileRespones save(MultipartFile file, String path) throws IOException {
		String extension = getExtension(file.getOriginalFilename());
		String name = UUID.randomUUID() + "." + extension;
		String uri = baseUrl + "/auth/" + name;
		Long size = file.getSize();

		Path filePath = Paths.get(path, name);

		try {
			Files.copy(file.getInputStream(), filePath);
		} catch (IOException e) {
			throw new IOException("Could not save file: " + file.getOriginalFilename(), e);
		}

		return FileRespones.builder().name(name).uri(uri).downloadUri(filePath.toString()).extension(extension)
				.size(size).build();
	}

	private String getExtension(String fileName) {
		int lastDotIndex = fileName.lastIndexOf(".");
		return lastDotIndex != -1 ? fileName.substring(lastDotIndex + 1) : "";
	}
	
	
	@Override
	public byte[] getFileName(String fileName) {
		try {
			Path filename = Paths.get("upload", fileName);
			return Files.readAllBytes(filename);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public String saveBase64Image(String path, byte[] base64Image) throws IOException {
		String uniqueId = UUID.randomUUID().toString();
		String newFileName = uniqueId + ".png";
		String fullPath = path + File.separator + newFileName;

		Files.createDirectories(Paths.get(path));
		Files.write(Paths.get(fullPath), base64Image);

		return newFileName;
	}

	@Override
	public FileRespones uploadSingle(MultipartFile file, String path) throws IOException {
		return this.save(file, path);
	}

	@Override
	public List<FileRespones> uploadMultiple(List<MultipartFile> files, String path) throws IOException {
		return files.stream().map(file -> {
			try {
				return save(file, path);
			} catch (IOException e) {
				throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
			}
		}).collect(Collectors.toList());
	}
	
	@Override
	public List<FileRespones> findAll() {
	    List<FileRespones> fileDtoList = new ArrayList<>();
	    Path directoryPath = Paths.get(path);
	    try (Stream<Path> paths = Files.list(directoryPath)) {
	        List<Path> pathList = paths.toList();
	        
	        for (Path p : pathList) {
	            Resource resource = new UrlResource(p.toUri());
	            
	            fileDtoList.add(FileRespones.builder()
	                    .name(resource.getFilename())
	                    .uri(baseUrl + "/auth/" + resource.getFilename())
	                    .downloadUri(baseUrl + "/auth/" + resource.getFilename())
	                    .extension(this.getExtension(resource.getFilename()))
	                    .size(resource.contentLength())
	                    .build());
	        }
	        
	        return fileDtoList;

	    } catch (IOException e) {
	    	
	        throw new RuntimeException("Failed to retrieve files", e);
	    }
	}
	
	@Override
	public void deleteAll() {
		Path directoryPath = Paths.get(path);
        try (Stream<Path> paths = Files.list(directoryPath)) {
            List<Path> pathList = paths.toList();
            for (Path p : pathList) {
                Files.delete(p);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
	}

	@Override
	public void deleteByName(String fileName) {
		Path directoryPath = Paths.get(path + fileName);
		try {
			boolean isDeleted = Files.deleteIfExists(directoryPath);
			if (!isDeleted)
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource is not found");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

	}
	
	@Override
	public Resource downloadByName(String fileName) {
		Path directoryPath = Paths.get(path + fileName);

        if (Files.exists(directoryPath)) {
            return UrlResource.from(directoryPath.toUri());
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Resource is not found");
	}
	

}
