package com.example.WebNovelReviewSite.domain.user.entity;

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
public class FollowId implements Serializable {

    @Column(name = "user_id")
    private Long userId; // 팔로우 거는 사람

    @Column(name = "target_id")
    private Long targetId; // 팔로우 당하는 사람
}
