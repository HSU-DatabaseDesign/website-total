package com.example.WebNovelReviewSite.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "follow")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Follow {
    
    @EmbeddedId
    private FollowId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id",nullable = false)
    private User follower; // 팔로우 거는 사람

    @MapsId("targetId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_id",nullable = false)
    private User target; // 팔로우 당하는 사람
}
