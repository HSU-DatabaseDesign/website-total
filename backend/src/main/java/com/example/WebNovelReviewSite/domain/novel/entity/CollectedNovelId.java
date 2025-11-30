package com.example.WebNovelReviewSite.domain.novel.entity;

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
public class CollectedNovelId implements Serializable {

    @Column(name="collection_id")
    private Long collectionId;

    @Column(name = "novel_id")
    private Long novelId;
}
