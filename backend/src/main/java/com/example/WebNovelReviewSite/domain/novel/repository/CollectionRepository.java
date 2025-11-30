package com.example.WebNovelReviewSite.domain.novel.repository;

import com.example.WebNovelReviewSite.domain.novel.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
    @Query("SELECT DISTINCT c FROM Collection c LEFT JOIN FETCH c.collectedNovels WHERE c.user.userId = :userId")
    List<Collection> findByUser_UserId(@Param("userId") Long userId);
    
    @Query("SELECT c FROM Collection c LEFT JOIN FETCH c.collectedNovels WHERE c.collectionId = :collectionId")
    Optional<Collection> findByIdWithNovels(@Param("collectionId") Long collectionId);
    
    @Query("SELECT DISTINCT c FROM Collection c LEFT JOIN FETCH c.collectedNovels")
    List<Collection> findAllWithNovels();
}
