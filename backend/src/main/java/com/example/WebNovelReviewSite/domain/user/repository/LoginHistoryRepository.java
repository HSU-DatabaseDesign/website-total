package com.example.WebNovelReviewSite.domain.user.repository;

import com.example.WebNovelReviewSite.domain.user.entity.LoginHistory;
import com.example.WebNovelReviewSite.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    
    // 특정 사용자의 특정 날짜 로그인 기록 조회
    Optional<LoginHistory> findByUserAndLoginDate(User user, LocalDate loginDate);
    
    // 특정 사용자의 총 출석 일수 조회
    @Query("SELECT COUNT(lh) FROM LoginHistory lh WHERE lh.user.userId = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    // 특정 사용자의 특정 날짜 로그인 기록 존재 여부
    boolean existsByUserAndLoginDate(User user, LocalDate loginDate);
}
