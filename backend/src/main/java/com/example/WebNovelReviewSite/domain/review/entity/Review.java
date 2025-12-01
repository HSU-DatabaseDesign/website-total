package com.example.WebNovelReviewSite.domain.review.entity;

import com.example.WebNovelReviewSite.domain.novel.entity.Novel;
import com.example.WebNovelReviewSite.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "review")
public class Review {

    // 리뷰 PK
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    //user - review
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    //review - novel
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "novel_id")
    private Novel novel;

    //리뷰 내용
    @Column(name="content", length = 255)
    private String content;

    //별점
    @Column(name="star", precision = 2, scale = 1)
    private BigDecimal star;

    //조회수
    @Column(name = "views")
    private Long views;

    //해시태그는 ReviewHashtagRepository를 통해 직접 조회 (복합 키 관계로 인해 @OneToMany 사용 불가)

    //좋아요
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "review_like",
                joinColumns = @JoinColumn(name = "review_id"),
                inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> userList = new ArrayList<>();
}
