package com.example.WebNovelReviewSite.domain.review.repository;

import com.example.WebNovelReviewSite.domain.review.entity.ReviewHashtag;
import com.example.WebNovelReviewSite.domain.review.entity.ReviewHashtagId;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewHashtagRepository extends JpaRepository<ReviewHashtag, ReviewHashtagId> {
    @Query("SELECT rh FROM ReviewHashtag rh JOIN FETCH rh.hashtag WHERE rh.reviewId = :reviewId")
    List<ReviewHashtag> findByReviewId(@Param("reviewId") Long reviewId);
    
    void deleteByReviewId(Long reviewId);
}

