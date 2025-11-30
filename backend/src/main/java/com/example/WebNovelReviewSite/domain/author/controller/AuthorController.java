package com.example.WebNovelReviewSite.domain.author.controller;

import com.example.WebNovelReviewSite.domain.author.dto.AuthorRequestDTO;
import com.example.WebNovelReviewSite.domain.author.dto.AuthorResponseDTO;
import com.example.WebNovelReviewSite.domain.author.service.AuthorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "작가 관리", description = "작가 프로필 등록, 수정, 조회 관련 API")
@RestController
@RequestMapping("/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @Operation(summary = "작가 프로필 등록", description = "작가 프로필을 등록합니다. 관리자 승인이 필요합니다.")
    @PostMapping
    public ResponseEntity<Long> createAuthor(@Valid @RequestBody AuthorRequestDTO.AuthorCreateDto request) {
        Long userId = authorService.createAuthor(request);
        return ResponseEntity.ok(userId);
    }

    @Operation(summary = "작가 프로필 수정", description = "작가 프로필 정보를 수정합니다.")
    @PutMapping("/{userId}")
    public ResponseEntity<Void> updateAuthor(@PathVariable Long userId,
            @Valid @RequestBody AuthorRequestDTO.AuthorUpdateDto request) {
        authorService.updateAuthor(userId, request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "작가 프로필 조회", description = "작가 프로필을 조회합니다.")
    @GetMapping("/{userId}")
    public ResponseEntity<AuthorResponseDTO.AuthorDetailDto> getAuthor(@PathVariable Long userId) {
        AuthorResponseDTO.AuthorDetailDto author = authorService.getAuthor(userId);
        return ResponseEntity.ok(author);
    }
    
    @Operation(summary = "전체 작가 목록 조회", description = "등록된 모든 작가 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<java.util.List<AuthorResponseDTO.AuthorDetailDto>> getAllAuthors() {
        java.util.List<AuthorResponseDTO.AuthorDetailDto> authors = authorService.getAllAuthors();
        return ResponseEntity.ok(authors);
    }
}
