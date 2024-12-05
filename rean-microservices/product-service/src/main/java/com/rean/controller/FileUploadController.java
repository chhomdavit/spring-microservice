package com.rean.controller;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rean.dto.FileRespones;
import com.rean.service.FileUploadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/upload")
public class FileUploadController {

	private final FileUploadService fileUploadService;

	@Value("${project.upload}")
	private String path;
	
	@GetMapping("/{fileName}")
	public ResponseEntity<ByteArrayResource> getFileName(@PathVariable String fileName) {
		if (fileName != null && !fileName.isEmpty()) {
			byte[] buffer = fileUploadService.getFileName(fileName);
			if (buffer != null) {
				ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);
				final MediaType image_PNG2 = MediaType.IMAGE_PNG;
				if (image_PNG2 != null) {
					return ResponseEntity.ok().contentLength(buffer.length).contentType(image_PNG2)
							.body(byteArrayResource);
				} else {
					return null;
				}
			}
		}
		return ResponseEntity.badRequest().build();
	}

	@PostMapping("/base64")
	public ResponseEntity<String> uploadBase64ImageHandler(@RequestBody String base64Image) throws IOException {

		if (base64Image == null || base64Image.isEmpty()) {
			return ResponseEntity.badRequest().body("Invalid base64 image data");
		}

		String base64ImageData = base64Image;
		if (base64Image.contains(",")) {
			base64ImageData = base64Image.split(",")[1];
		}

		byte[] decodedImage = Base64.getMimeDecoder().decode(base64ImageData);
		String uploadedFileName = fileUploadService.saveBase64Image(path, decodedImage);
		return ResponseEntity.ok("Base64 image upload: " + uploadedFileName);
	}

	@PostMapping(value = "/single", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public FileRespones uploadSingle(@RequestPart MultipartFile file) throws IOException {
		return fileUploadService.uploadSingle(file, path);
	}

	@PostMapping(value = "/multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public List<FileRespones> uploadMultiple(@RequestPart List<MultipartFile> files) throws IOException {
		return fileUploadService.uploadMultiple(files, path);
	}
	
	@GetMapping("/findAll")
    public List<FileRespones> findAll() {
        return fileUploadService.findAll();
    }
	
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@DeleteMapping("/{fileName}")
	public void deleteByName(@PathVariable String fileName) {
		fileUploadService.deleteByName(fileName);
	}
	
	@ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping
    public void deleteAll() {
		fileUploadService.deleteAll();
    }
	
	@GetMapping(value = "/download/{fileName}")
    public ResponseEntity<?> download(@PathVariable String fileName) {
        Resource resource = fileUploadService.downloadByName(fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition",
                        "attachment; filename=" + resource.getFilename())
                .body(resource);
    }
	
}
