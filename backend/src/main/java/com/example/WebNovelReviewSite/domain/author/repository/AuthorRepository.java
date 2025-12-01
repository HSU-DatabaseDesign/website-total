package com.example.WebNovelReviewSite.domain.author.repository;

import com.example.WebNovelReviewSite.domain.author.entity.AuthorInfo;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AuthorRepository extends JpaRepository<AuthorInfo, Long> {
    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT a FROM AuthorInfo a WHERE a.userId = :userId")
    Optional<AuthorInfo> findByIdWithUser(@Param("userId") Long userId);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT a FROM AuthorInfo a WHERE a.isConfirmed = false")
    java.util.List<AuthorInfo> findAllPending();
}
