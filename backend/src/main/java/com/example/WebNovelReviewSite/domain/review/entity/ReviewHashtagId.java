package com.example.WebNovelReviewSite.domain.review.entity;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ReviewHashtagId implements Serializable {
    private Long reviewId;
    private Long hashtagId;
}

