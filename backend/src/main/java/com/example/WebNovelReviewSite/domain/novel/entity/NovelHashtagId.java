package com.example.WebNovelReviewSite.domain.novel.entity;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class NovelHashtagId implements Serializable {
    private Long novelId;
    private Long hashtagId;
}

