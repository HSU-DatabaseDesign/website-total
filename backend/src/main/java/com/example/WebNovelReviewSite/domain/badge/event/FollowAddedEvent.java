package com.example.WebNovelReviewSite.domain.badge.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class FollowAddedEvent extends ApplicationEvent {
    private final Long userId;      // 팔로우를 하는 사람
    private final Long targetId;    // 팔로우를 받는 사람 (팔로워 배지 대상)

    public FollowAddedEvent(Object source, Long userId, Long targetId) {
        super(source);
        this.userId = userId;
        this.targetId = targetId;
    }
}

