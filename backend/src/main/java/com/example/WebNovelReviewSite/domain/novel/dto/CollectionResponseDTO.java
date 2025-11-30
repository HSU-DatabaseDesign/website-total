package com.example.WebNovelReviewSite.domain.novel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class CollectionResponseDTO {

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CollectionDetailDto {
        private Long collectionId;
        private Long userId;
        private String userName;
        private String collectionName;
        private String content;
        private Integer novelCount;
        private Long saveCount;  // 저장 수
        private Boolean isSaved; // 현재 유저가 저장했는지 여부
        private LocalDateTime createdAt;
        private List<NovelSimpleDto> novels;
    }
    
    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NovelSimpleDto {
        private Long novelId;
        private String novelName;
        private String novelAuthor;
        private String genre;
        private String novelStatus;
    }
}
