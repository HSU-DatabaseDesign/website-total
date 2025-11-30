package com.example.WebNovelReviewSite.domain.badge.repository;

import com.example.WebNovelReviewSite.domain.badge.entity.Badge;
import com.example.WebNovelReviewSite.domain.badge.entity.UserBadge;
import com.example.WebNovelReviewSite.domain.badge.entity.UserBadgeId;
import com.example.WebNovelReviewSite.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserBadgeRepository extends JpaRepository<UserBadge, UserBadgeId> {
    List<UserBadge> findByUser(User user);

    List<UserBadge> findByBadge(Badge badge);

    @Query("SELECT ub FROM UserBadge ub WHERE ub.user.userId = :userId")
    List<UserBadge> findByUserId(@Param("userId") Long userId);

    @Query("SELECT ub FROM UserBadge ub WHERE ub.badge.badgeId = :badgeId")
    List<UserBadge> findByBadgeId(@Param("badgeId") Long badgeId);

    @Query("SELECT CASE WHEN COUNT(ub) > 0 THEN true ELSE false END FROM UserBadge ub WHERE ub.user.userId = :userId AND ub.badge.badgeId = :badgeId")
    boolean existsByUserIdAndBadgeId(@Param("userId") Long userId, @Param("badgeId") Long badgeId);

    Optional<UserBadge> findByUserAndBadge(User user, Badge badge);
}

