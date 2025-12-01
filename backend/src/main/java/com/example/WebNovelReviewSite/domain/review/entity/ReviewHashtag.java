package com.example.WebNovelReviewSite.domain.review.entity;

import com.example.WebNovelReviewSite.domain.hashtag.entity.Hashtag;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "review_hashtag")
@IdClass(ReviewHashtagId.class)
public class ReviewHashtag {

    @Id
    @Column(name = "review_id")
    private Long reviewId;

    @Id
    @Column(name = "hashtag_id")
    private Long hashtagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", insertable = false, updatable = false)
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hashtag_id", insertable = false, updatable = false)
    private Hashtag hashtag;
}

