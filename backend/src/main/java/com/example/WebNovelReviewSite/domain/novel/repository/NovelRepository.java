package com.example.WebNovelReviewSite.domain.novel.repository;

import com.example.WebNovelReviewSite.domain.novel.entity.Novel;
import com.example.WebNovelReviewSite.domain.novel.enums.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NovelRepository extends JpaRepository<Novel, Long> {
    List<Novel> findByGenre(Genre genre);

    List<Novel> findByNovelNameContainingOrNovelAuthorContaining(String name, String author);
}
