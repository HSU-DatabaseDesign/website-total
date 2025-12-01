package com.example.WebNovelReviewSite.domain.review.controller;

import com.example.WebNovelReviewSite.domain.review.dto.ReviewRequestDTO;
import com.example.WebNovelReviewSite.domain.review.dto.ReviewResponseDTO;
import com.example.WebNovelReviewSite.domain.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "리뷰 관리", description = "리뷰 작성, 수정, 삭제, 조회, 좋아요 관련 API")
@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "리뷰 작성", description = "웹소설에 대한 리뷰를 작성합니다. 작품당 1인 1개 리뷰 제한.")
    @PostMapping
    public ResponseEntity<Long> createReview(@Valid @RequestBody ReviewRequestDTO.ReviewCreateDto request) {
        Long reviewId = reviewService.createReview(request);
        return ResponseEntity.ok(reviewId);
    }

    @Operation(summary = "리뷰 수정", description = "본인이 작성한 리뷰를 수정합니다.")
    @PutMapping("/{reviewId}")
    public ResponseEntity<Void> updateReview(@PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequestDTO.ReviewUpdateDto request) {
        reviewService.updateReview(reviewId, request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "리뷰 삭제", description = "리뷰를 삭제합니다. 관련된 좋아요도 함께 삭제됩니다.")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "웹소설별 리뷰 목록 조회", description = "특정 웹소설의 모든 리뷰를 조회합니다.")
    @GetMapping("/novel/{novelId}")
    public ResponseEntity<List<ReviewResponseDTO.ReviewDetailDto>> getReviewsByNovel(@PathVariable Long novelId) {
        List<ReviewResponseDTO.ReviewDetailDto> reviews = reviewService.getReviewsByNovel(novelId);
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "리뷰 상세 조회", description = "특정 리뷰의 상세 정보를 조회합니다.")
    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponseDTO.ReviewDetailDto> getReview(@PathVariable Long reviewId) {
        ReviewResponseDTO.ReviewDetailDto review = reviewService.getReview(reviewId);
        return ResponseEntity.ok(review);
    }

    @Operation(summary = "리뷰 좋아요 추가", description = "타인의 리뷰에 좋아요를 추가합니다. 리뷰당 1번만 가능.")
    @PostMapping("/{reviewId}/like")
    public ResponseEntity<Void> addLike(@PathVariable Long reviewId, @RequestParam Long userId) {
        reviewService.addLike(reviewId, userId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "리뷰 좋아요 취소", description = "리뷰의 좋아요를 취소합니다.")
    @DeleteMapping("/{reviewId}/like")
    public ResponseEntity<Void> removeLike(@PathVariable Long reviewId, @RequestParam Long userId) {
        reviewService.removeLike(reviewId, userId);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "사용자별 리뷰 목록 조회", description = "특정 사용자가 작성한 모든 리뷰를 조회합니다.")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponseDTO.ReviewDetailDto>> getReviewsByUser(@PathVariable Long userId) {
        List<ReviewResponseDTO.ReviewDetailDto> reviews = reviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(reviews);
    }
    
    @Operation(summary = "전체 리뷰 목록 조회", description = "모든 리뷰를 최신순으로 조회합니다.")
    @GetMapping
    public ResponseEntity<List<ReviewResponseDTO.ReviewDetailDto>> getAllReviews() {
        List<ReviewResponseDTO.ReviewDetailDto> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
}
