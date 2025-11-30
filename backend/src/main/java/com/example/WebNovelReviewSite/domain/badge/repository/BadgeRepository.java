package com.example.WebNovelReviewSite.domain.badge.repository;

import com.example.WebNovelReviewSite.domain.badge.entity.Badge;
import com.example.WebNovelReviewSite.domain.badge.enums.BadgeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Optional<Badge> findByBadgeName(String badgeName);

    List<Badge> findByBadgeType(BadgeType badgeType);

    @Query("SELECT b FROM Badge b WHERE b.startDate <= :now AND (b.endDate IS NULL OR b.endDate >= :now)")
    List<Badge> findActiveBadges(@Param("now") LocalDateTime now);

    @Query("SELECT b FROM Badge b WHERE b.badgeType = :badgeType AND b.startDate <= :now AND (b.endDate IS NULL OR b.endDate >= :now)")
    List<Badge> findActiveBadgesByType(@Param("badgeType") BadgeType badgeType, @Param("now") LocalDateTime now);
}

