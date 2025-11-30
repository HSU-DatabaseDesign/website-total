package com.example.WebNovelReviewSite.domain.novel.controller;

import com.example.WebNovelReviewSite.domain.novel.dto.CollectionRequestDTO;
import com.example.WebNovelReviewSite.domain.novel.dto.CollectionResponseDTO;
import com.example.WebNovelReviewSite.domain.novel.service.CollectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "컬렉션 관리", description = "컬렉션 생성, 수정, 삭제, 작품 추가/삭제 관련 API")
@RestController
@RequestMapping("/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @Operation(summary = "컬렉션 생성", description = "새로운 컬렉션을 생성합니다.")
    @PostMapping
    public ResponseEntity<Long> createCollection(@Valid @RequestBody CollectionRequestDTO.CollectionCreateDto request) {
        Long collectionId = collectionService.createCollection(request);
        return ResponseEntity.ok(collectionId);
    }

    @Operation(summary = "컬렉션 수정", description = "컬렉션의 이름과 설명을 수정합니다.")
    @PutMapping("/{collectionId}")
    public ResponseEntity<Void> updateCollection(@PathVariable Long collectionId,
            @Valid @RequestBody CollectionRequestDTO.CollectionUpdateDto request) {
        collectionService.updateCollection(collectionId, request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "컬렉션 삭제", description = "컬렉션을 삭제합니다.")
    @DeleteMapping("/{collectionId}")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long collectionId) {
        collectionService.deleteCollection(collectionId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "컬렉션에 작품 추가", description = "컬렉션에 웹소설을 추가합니다.")
    @PostMapping("/{collectionId}/novels/{novelId}")
    public ResponseEntity<Void> addNovelToCollection(@PathVariable Long collectionId, @PathVariable Long novelId) {
        collectionService.addNovelToCollection(collectionId, novelId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "컬렉션에서 작품 삭제", description = "컬렉션에서 웹소설을 삭제합니다.")
    @DeleteMapping("/{collectionId}/novels/{novelId}")
    public ResponseEntity<Void> removeNovelFromCollection(@PathVariable Long collectionId, @PathVariable Long novelId) {
        collectionService.removeNovelFromCollection(collectionId, novelId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "사용자 컬렉션 목록 조회", description = "특정 사용자의 모든 컬렉션을 조회합니다.")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CollectionResponseDTO.CollectionDetailDto>> getCollectionsByUser(
            @PathVariable Long userId) {
        List<CollectionResponseDTO.CollectionDetailDto> collections = collectionService.getCollectionsByUser(userId);
        return ResponseEntity.ok(collections);
    }

    @Operation(summary = "컬렉션 상세 조회", description = "컬렉션의 상세 정보를 조회합니다.")
    @GetMapping("/{collectionId}")
    public ResponseEntity<CollectionResponseDTO.CollectionDetailDto> getCollection(@PathVariable Long collectionId) {
        CollectionResponseDTO.CollectionDetailDto collection = collectionService.getCollection(collectionId);
        return ResponseEntity.ok(collection);
    }
    
    @Operation(summary = "전체 컬렉션 목록 조회", description = "모든 컬렉션을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<CollectionResponseDTO.CollectionDetailDto>> getAllCollections(
            @RequestParam(required = false) Long currentUserId) {
        List<CollectionResponseDTO.CollectionDetailDto> collections = collectionService.getAllCollections(currentUserId);
        return ResponseEntity.ok(collections);
    }
    
    @Operation(summary = "컬렉션 상세 조회 (현재 유저 정보 포함)", description = "컬렉션의 상세 정보를 조회합니다. 현재 유저의 저장 여부도 포함됩니다.")
    @GetMapping("/{collectionId}/detail")
    public ResponseEntity<CollectionResponseDTO.CollectionDetailDto> getCollectionWithUser(
            @PathVariable Long collectionId,
            @RequestParam(required = false) Long currentUserId) {
        CollectionResponseDTO.CollectionDetailDto collection = collectionService.getCollection(collectionId, currentUserId);
        return ResponseEntity.ok(collection);
    }
    
    @Operation(summary = "컬렉션 저장", description = "다른 사용자의 컬렉션을 저장(북마크)합니다.")
    @PostMapping("/{collectionId}/save")
    public ResponseEntity<Void> saveCollection(
            @PathVariable Long collectionId,
            @RequestParam Long userId) {
        collectionService.saveCollection(userId, collectionId);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "컬렉션 저장 취소", description = "저장한 컬렉션을 취소합니다.")
    @DeleteMapping("/{collectionId}/save")
    public ResponseEntity<Void> unsaveCollection(
            @PathVariable Long collectionId,
            @RequestParam Long userId) {
        collectionService.unsaveCollection(userId, collectionId);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "저장한 컬렉션 목록 조회", description = "사용자가 저장한 컬렉션 목록을 조회합니다.")
    @GetMapping("/saved/{userId}")
    public ResponseEntity<List<CollectionResponseDTO.CollectionDetailDto>> getSavedCollections(
            @PathVariable Long userId) {
        List<CollectionResponseDTO.CollectionDetailDto> collections = collectionService.getSavedCollections(userId);
        return ResponseEntity.ok(collections);
    }
}
