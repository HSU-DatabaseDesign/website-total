package com.example.WebNovelReviewSite.domain.user.dto;

import com.example.WebNovelReviewSite.domain.user.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class UserResponseDTO {

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDetailDto {
        private Long userId;
        private String name;
        private String id;
        private String nickname;
        private String email;
        private Role role;
    }
}
