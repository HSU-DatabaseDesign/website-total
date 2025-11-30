package com.example.WebNovelReviewSite.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class FollowResponseDTO {

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FollowUserDto {
        private Long userId;
        private String name;
        private String nickname;
    }
}
