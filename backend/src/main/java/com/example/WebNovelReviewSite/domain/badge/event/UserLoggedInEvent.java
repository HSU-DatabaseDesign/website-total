package com.example.WebNovelReviewSite.domain.badge.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class UserLoggedInEvent extends ApplicationEvent {
    private final Long userId;

    public UserLoggedInEvent(Object source, Long userId) {
        super(source);
        this.userId = userId;
    }
}

