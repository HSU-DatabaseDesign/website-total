package com.example.WebNovelReviewSite.domain.badge.dto;

import com.example.WebNovelReviewSite.domain.badge.enums.BadgeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BadgeResponseDTO {

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BadgeDetailDto {
        private Long badgeId;
        private String badgeName;
        private String badgeImage;
        private BadgeType badgeType;
        private String badgeMission;
        private Integer conditionValue;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserBadgeDto {
        private Long userId;
        private Long badgeId;
        private String badgeName;
        private String badgeImage;
        private BadgeType badgeType;
        private String badgeMission;
        private Integer conditionValue;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserBadgeListDto {
        private Long userId;
        private List<UserBadgeDto> badges;

        public static UserBadgeListDto of(Long userId, List<UserBadgeDto> badges) {
            return UserBadgeListDto.builder()
                    .userId(userId)
                    .badges(badges)
                    .build();
        }
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BadgeProgressDto {
        private Long badgeId;
        private String badgeName;
        private String badgeImage;
        private BadgeType badgeType;
        private String badgeMission;
        private Integer conditionValue;
        private Integer currentValue;
        private boolean unlocked;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserBadgeProgressListDto {
        private Long userId;
        private List<BadgeProgressDto> badges;

        public static UserBadgeProgressListDto of(Long userId, List<BadgeProgressDto> badges) {
            return UserBadgeProgressListDto.builder()
                    .userId(userId)
                    .badges(badges)
                    .build();
        }
    }
}

