package com.example.WebNovelReviewSite.domain.author.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class AuthorResponseDTO {

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorDetailDto {
        private Long userId;
        private String penName;
        private String nationality;
        private String debutYear;
        private String brief;
        private String profileImage;
        private Boolean isConfirmed;
    }
}
