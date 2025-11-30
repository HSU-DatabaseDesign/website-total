package com.example.WebNovelReviewSite.domain.novel.entity;

import com.example.WebNovelReviewSite.domain.novel.enums.Genre;
import com.example.WebNovelReviewSite.domain.novel.enums.NovelStatus;
import com.example.WebNovelReviewSite.domain.novel.enums.Platform;
import com.example.WebNovelReviewSite.domain.novel.enums.RestrictedType;
import com.example.WebNovelReviewSite.domain.review.entity.Review;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "novel")
public class Novel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "novel_id")
    private Long novelId;

    @Column(name = "novel_name",length = 255)
    private String novelName;

    @Column(name ="novel_author",length = 20)
    private String novelAuthor;

    @Column(name = "novel_context")
    private String novelContext;

    @Column(name = "genre")
    @Enumerated(EnumType.STRING)
    private Genre genre;

    @Column(name = "restricted")
    @Enumerated(EnumType.STRING)
    private RestrictedType restricted;

    @Column(name = "novel_status")
    @Enumerated(EnumType.STRING)
    private NovelStatus novelStatus;

    @Column(name = "platform")
    @Enumerated(EnumType.STRING)
    private Platform platform;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    //novel - collected_novel
    @OneToMany(mappedBy = "novel",fetch = FetchType.LAZY)
    private List<CollectedNovel> collectedNovels = new ArrayList<>();

    //novel - review
    @OneToMany(mappedBy = "novel", fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();
}
