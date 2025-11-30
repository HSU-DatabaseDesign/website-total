package com.example.WebNovelReviewSite.domain.badge.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ReviewLikedEvent extends ApplicationEvent {
    private final Long reviewAuthorId;

    public ReviewLikedEvent(Object source, Long reviewAuthorId) {
        super(source);
        this.reviewAuthorId = reviewAuthorId;
    }
}

