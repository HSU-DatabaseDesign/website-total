package com.example.WebNovelReviewSite.domain.novel.repository;

import com.example.WebNovelReviewSite.domain.novel.entity.NovelHashtag;
import com.example.WebNovelReviewSite.domain.novel.entity.NovelHashtagId;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NovelHashtagRepository extends JpaRepository<NovelHashtag, NovelHashtagId> {
    @Query("SELECT nh FROM NovelHashtag nh JOIN FETCH nh.hashtag WHERE nh.novelId = :novelId")
    List<NovelHashtag> findByNovelId(@Param("novelId") Long novelId);
    
    void deleteByNovelId(Long novelId);
}

