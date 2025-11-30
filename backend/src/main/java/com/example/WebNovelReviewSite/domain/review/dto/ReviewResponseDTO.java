package com.example.WebNovelReviewSite.domain.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class ReviewResponseDTO {

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewDetailDto {
        private Long reviewId;
        private Long userId;
        private String userName;
        private Long novelId;
        private String novelName;
        private String content;
        private BigDecimal star;
        private Long views;
        private Long likeCount;
        private List<String> hashtags;
    }
}
