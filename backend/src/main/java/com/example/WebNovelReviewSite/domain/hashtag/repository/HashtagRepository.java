package com.example.WebNovelReviewSite.domain.hashtag.repository;

import com.example.WebNovelReviewSite.domain.hashtag.entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
    Optional<Hashtag> findByHashtagName(String hashtagName);
    
    List<Hashtag> findByHashtagNameIn(List<String> hashtagNames);
}

