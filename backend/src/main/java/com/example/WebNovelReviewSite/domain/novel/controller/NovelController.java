package com.example.WebNovelReviewSite.domain.novel.controller;

import com.example.WebNovelReviewSite.domain.novel.dto.NovelResponseDTO;
import com.example.WebNovelReviewSite.domain.novel.enums.Genre;
import com.example.WebNovelReviewSite.domain.novel.service.NovelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "웹소설 관리", description = "웹소설 조회, 검색, 장르별 조회 관련 API")
@RestController
@RequestMapping("/novels")
@RequiredArgsConstructor
public class NovelController {

    private final NovelService novelService;

    @Operation(summary = "전체 웹소설 목록 조회", description = "등록된 모든 웹소설을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<NovelResponseDTO.NovelDetailDto>> getAllNovels() {
        List<NovelResponseDTO.NovelDetailDto> novels = novelService.getAllNovels();
        return ResponseEntity.ok(novels);
    }

    @Operation(summary = "웹소설 상세 조회", description = "웹소설 ID로 상세 정보를 조회합니다.")
    @GetMapping("/{novelId}")
    public ResponseEntity<NovelResponseDTO.NovelDetailDto> getNovel(@PathVariable Long novelId) {
        try {
            NovelResponseDTO.NovelDetailDto novel = novelService.getNovel(novelId);
            return ResponseEntity.ok(novel);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "장르별 웹소설 조회", description = "특정 장르의 웹소설 목록을 조회합니다.")
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<NovelResponseDTO.NovelDetailDto>> getNovelsByGenre(@PathVariable Genre genre) {
        List<NovelResponseDTO.NovelDetailDto> novels = novelService.getNovelsByGenre(genre);
        return ResponseEntity.ok(novels);
    }

    @Operation(summary = "웹소설 검색", description = "제목 또는 작가명으로 웹소설을 검색합니다.")
    @GetMapping("/search")
    public ResponseEntity<List<NovelResponseDTO.NovelDetailDto>> searchNovels(@RequestParam String keyword) {
        List<NovelResponseDTO.NovelDetailDto> novels = novelService.searchNovels(keyword);
        return ResponseEntity.ok(novels);
    }
}
