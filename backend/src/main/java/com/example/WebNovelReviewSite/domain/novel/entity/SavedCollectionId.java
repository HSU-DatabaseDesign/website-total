package com.example.WebNovelReviewSite.domain.novel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SavedCollectionId implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "collection_id")
    private Long collectionId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SavedCollectionId that = (SavedCollectionId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(collectionId, that.collectionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, collectionId);
    }
}
