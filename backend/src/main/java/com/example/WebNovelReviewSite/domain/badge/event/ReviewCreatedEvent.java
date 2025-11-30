package com.example.WebNovelReviewSite.domain.badge.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ReviewCreatedEvent extends ApplicationEvent {
    private final Long userId;

    public ReviewCreatedEvent(Object source, Long userId) {
        super(source);
        this.userId = userId;
    }
}

