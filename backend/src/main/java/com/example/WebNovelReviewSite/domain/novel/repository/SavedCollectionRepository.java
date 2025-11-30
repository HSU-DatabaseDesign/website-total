package com.example.WebNovelReviewSite.domain.novel.repository;

import com.example.WebNovelReviewSite.domain.novel.entity.SavedCollection;
import com.example.WebNovelReviewSite.domain.novel.entity.SavedCollectionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SavedCollectionRepository extends JpaRepository<SavedCollection, SavedCollectionId> {
    
    // 특정 유저가 저장한 컬렉션 목록
    @Query("SELECT sc FROM SavedCollection sc JOIN FETCH sc.collection c JOIN FETCH c.user WHERE sc.user.userId = :userId")
    List<SavedCollection> findByUser_UserId(@Param("userId") Long userId);
    
    // 특정 컬렉션의 저장 수
    @Query("SELECT COUNT(sc) FROM SavedCollection sc WHERE sc.collection.collectionId = :collectionId")
    Long countByCollectionId(@Param("collectionId") Long collectionId);
    
    // 특정 유저가 특정 컬렉션을 저장했는지 확인
    boolean existsById(SavedCollectionId id);
}
