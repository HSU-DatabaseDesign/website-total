package com.example.WebNovelReviewSite.domain.review.repository;

import com.example.WebNovelReviewSite.domain.review.entity.Review;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @EntityGraph(attributePaths = {"user", "novel", "userList"})
    @Query("SELECT r FROM Review r WHERE r.novel.novelId = :novelId")
    List<Review> findByNovel_NovelId(@Param("novelId") Long novelId);

    boolean existsByUser_UserIdAndNovel_NovelId(Long userId, Long novelId);

    @EntityGraph(attributePaths = {"user", "novel", "userList"})
    @Query("SELECT r FROM Review r WHERE r.reviewId = :reviewId")
    Optional<Review> findByIdWithUser(@Param("reviewId") Long reviewId);
    
    @EntityGraph(attributePaths = {"user", "novel", "userList"})
    @Query("SELECT r FROM Review r WHERE r.user.userId = :userId")
    List<Review> findByUser_UserId(@Param("userId") Long userId);
    
    @EntityGraph(attributePaths = {"user", "novel", "userList"})
    @Query("SELECT r FROM Review r ORDER BY r.reviewId DESC")
    List<Review> findAllOrderByReviewIdDesc();
}
