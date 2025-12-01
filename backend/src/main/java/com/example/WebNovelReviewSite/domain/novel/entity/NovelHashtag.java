package com.example.WebNovelReviewSite.domain.novel.entity;

import com.example.WebNovelReviewSite.domain.hashtag.entity.Hashtag;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "novel_hashtag")
@IdClass(NovelHashtagId.class)
public class NovelHashtag {

    @Id
    @Column(name = "novel_id")
    private Long novelId;

    @Id
    @Column(name = "hashtag_id")
    private Long hashtagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "novel_id", insertable = false, updatable = false)
    private Novel novel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hashtag_id", insertable = false, updatable = false)
    private Hashtag hashtag;
}

