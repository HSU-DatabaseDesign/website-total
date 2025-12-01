package com.example.WebNovelReviewSite.domain.novel.repository;

import com.example.WebNovelReviewSite.domain.novel.entity.Novel;
import com.example.WebNovelReviewSite.domain.novel.enums.Genre;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NovelRepository extends JpaRepository<Novel, Long> {
    List<Novel> findByGenre(Genre genre);

    List<Novel> findByNovelNameContainingOrNovelAuthorContaining(String name, String author);
    
    @EntityGraph(attributePaths = {"reviews"})
    @Query("SELECT n FROM Novel n WHERE n.novelId = :novelId")
    Optional<Novel> findByIdWithReviews(@Param("novelId") Long novelId);
    
    @EntityGraph(attributePaths = {"reviews"})
    @Query("SELECT n FROM Novel n")
    List<Novel> findAllWithReviews();
    
    @EntityGraph(attributePaths = {"reviews"})
    @Query("SELECT n FROM Novel n WHERE n.genre = :genre")
    List<Novel> findByGenreWithReviews(@Param("genre") Genre genre);
}
