package com.example.WebNovelReviewSite.domain.author.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class AuthorRequestDTO {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorCreateDto {
        @NotNull(message = "사용자 ID는 필수입니다")
        private Long userId;

        @NotBlank(message = "필명은 필수입니다")
        @Size(max = 50, message = "필명은 50자 이하여야 합니다")
        private String penName;

        @NotBlank(message = "국적은 필수입니다")
        @Size(max = 50, message = "국적은 50자 이하여야 합니다")
        private String nationality;

        @Size(max = 4, message = "데뷔년도는 4자리여야 합니다")
        private String debutYear;

        @Size(max = 500, message = "간략 소개는 500자 이하여야 합니다")
        private String brief;

        @Size(max = 255, message = "프로필 이미지 경로는 255자 이하여야 합니다")
        private String profileImage;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorUpdateDto {
        @Size(max = 50, message = "필명은 50자 이하여야 합니다")
        private String penName;

        @Size(max = 50, message = "국적은 50자 이하여야 합니다")
        private String nationality;

        @Size(max = 4, message = "데뷔년도는 4자리여야 합니다")
        private String debutYear;

        @Size(max = 500, message = "간략 소개는 500자 이하여야 합니다")
        private String brief;

        @Size(max = 255, message = "프로필 이미지 경로는 255자 이하여야 합니다")
        private String profileImage;
    }
}
