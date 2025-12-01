package com.example.WebNovelReviewSite.domain.novel.dto;

import com.example.WebNovelReviewSite.domain.novel.enums.Genre;
import com.example.WebNovelReviewSite.domain.novel.enums.NovelStatus;
import com.example.WebNovelReviewSite.domain.novel.enums.Platform;
import com.example.WebNovelReviewSite.domain.novel.enums.RestrictedType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class NovelResponseDTO {

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NovelDetailDto {
        private Long novelId;
        private String novelName;
        private String novelAuthor;
        private String novelContext;
        private Genre genre;
        private RestrictedType restricted;
        private NovelStatus novelStatus;
        private Platform platform;
        private LocalDateTime registrationDate;
        private Double averageRating;
        private Long reviewCount;
        private List<String> hashtags;
    }
}
