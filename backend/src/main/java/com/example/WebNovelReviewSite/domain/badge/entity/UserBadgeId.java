package com.example.WebNovelReviewSite.domain.badge.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

//복합 키 클래스
@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode
public class UserBadgeId implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "badge_id")
    private Long badgeId;
}

