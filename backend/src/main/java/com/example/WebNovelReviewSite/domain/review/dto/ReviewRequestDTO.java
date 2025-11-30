package com.example.WebNovelReviewSite.domain.review.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class ReviewRequestDTO {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewCreateDto {
        @NotNull(message = "사용자 ID는 필수입니다")
        private Long userId;

        @NotNull(message = "소설 ID는 필수입니다")
        private Long novelId;

        @NotBlank(message = "리뷰 내용은 필수입니다")
        @Size(max = 255, message = "리뷰 내용은 255자 이하여야 합니다")
        private String content;

        @NotNull(message = "별점은 필수입니다")
        @DecimalMin(value = "0.0", message = "별점은 0.0 이상이어야 합니다")
        @DecimalMax(value = "5.0", message = "별점은 5.0 이하여야 합니다")
        private BigDecimal star;

        private List<String> hashtags;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewUpdateDto {
        @Size(max = 255, message = "리뷰 내용은 255자 이하여야 합니다")
        private String content;

        @DecimalMin(value = "0.0", message = "별점은 0.0 이상이어야 합니다")
        @DecimalMax(value = "5.0", message = "별점은 5.0 이하여야 합니다")
        private BigDecimal star;

        private List<String> hashtags;
    }
}
