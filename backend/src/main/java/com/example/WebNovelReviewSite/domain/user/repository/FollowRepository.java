package com.example.WebNovelReviewSite.domain.user.repository;

import com.example.WebNovelReviewSite.domain.user.entity.Follow;
import com.example.WebNovelReviewSite.domain.user.entity.FollowId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, FollowId> {
    List<Follow> findByFollower_UserId(Long userId);

    List<Follow> findByTarget_UserId(Long userId);
}
