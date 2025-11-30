package com.example.WebNovelReviewSite.domain.author.repository;

import com.example.WebNovelReviewSite.domain.author.entity.AuthorInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<AuthorInfo, Long> {
}
