package com.example.WebNovelReviewSite.domain.novel.repository;

import com.example.WebNovelReviewSite.domain.novel.entity.CollectedNovel;
import com.example.WebNovelReviewSite.domain.novel.entity.CollectedNovelId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectedNovelRepository extends JpaRepository<CollectedNovel, CollectedNovelId> {
}
