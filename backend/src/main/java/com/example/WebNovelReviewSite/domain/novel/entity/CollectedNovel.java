package com.example.WebNovelReviewSite.domain.novel.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "collected_novel")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CollectedNovel {

    @EmbeddedId
    private CollectedNovelId collectedNovelId;

    @MapsId("collectionId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id",nullable = false)
    private Collection collection;

    @MapsId("novelId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "novel_id",nullable = false)
    private Novel novel;
}
