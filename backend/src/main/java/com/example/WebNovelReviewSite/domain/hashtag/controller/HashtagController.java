package com.example.WebNovelReviewSite.domain.hashtag.controller;

import com.example.WebNovelReviewSite.domain.hashtag.entity.Hashtag;
import com.example.WebNovelReviewSite.domain.hashtag.repository.HashtagRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "해시태그 관리", description = "해시태그 조회 관련 API")
@RestController
@RequestMapping("/hashtags")
@RequiredArgsConstructor
public class HashtagController {

    private final HashtagRepository hashtagRepository;

    @Operation(summary = "전체 해시태그 목록 조회", description = "DB에 저장된 모든 해시태그를 조회합니다.")
    @GetMapping
    public ResponseEntity<List<String>> getAllHashtags() {
        List<String> hashtagNames = hashtagRepository.findAll().stream()
                .map(Hashtag::getHashtagName)
                .sorted()
                .collect(Collectors.toList());
        return ResponseEntity.ok(hashtagNames);
    }
}

