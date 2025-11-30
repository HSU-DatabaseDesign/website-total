package com.example.WebNovelReviewSite.domain.user.repository;

import com.example.WebNovelReviewSite.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.id = :loginId")
    Optional<User> findByLoginId(@Param("loginId") String loginId);

    Optional<User> findByEmail(String email);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.id = :loginId")
    boolean existsByLoginId(@Param("loginId") String loginId);

    boolean existsByEmail(String email);
}
