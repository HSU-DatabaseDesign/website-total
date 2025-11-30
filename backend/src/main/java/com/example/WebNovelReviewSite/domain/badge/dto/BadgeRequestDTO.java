package com.example.WebNovelReviewSite.domain.badge.dto;

import com.example.WebNovelReviewSite.domain.badge.enums.BadgeType;
import com.example.WebNovelReviewSite.domain.badge.validation.ValidBadgeCreate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class BadgeRequestDTO {

    @ValidBadgeCreate
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BadgeCreateDto {
        @NotBlank(message = "뱃지명은 필수입니다")
        @Size(max = 20, message = "뱃지명은 20자 이하여야 합니다")
        private String badgeName;

        @Size(max = 255, message = "뱃지 이미지 URL은 255자 이하여야 합니다")
        private String badgeImage;

        @NotNull(message = "뱃지 타입은 필수입니다")
        private BadgeType badgeType;

        @Size(max = 30, message = "뱃지 내용은 30자 이하여야 합니다")
        private String badgeMission;

        private Integer conditionValue;

        private LocalDateTime startDate;

        private LocalDateTime endDate;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BadgeUpdateDto {
        @Size(max = 20, message = "뱃지명은 20자 이하여야 합니다")
        private String badgeName;

        @Size(max = 255, message = "뱃지 이미지 URL은 255자 이하여야 합니다")
        private String badgeImage;

        private BadgeType badgeType;

        @Size(max = 30, message = "뱃지 내용은 30자 이하여야 합니다")
        private String badgeMission;

        private Integer conditionValue;

        private LocalDateTime startDate;

        private LocalDateTime endDate;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserBadgeAssignDto {
        @NotNull(message = "유저 ID는 필수입니다")
        private Long userId;

        @NotNull(message = "뱃지 ID는 필수입니다")
        private Long badgeId;
    }
}

