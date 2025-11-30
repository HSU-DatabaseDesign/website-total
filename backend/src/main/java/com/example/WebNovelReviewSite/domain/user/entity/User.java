package com.example.WebNovelReviewSite.domain.user.entity;

import com.example.WebNovelReviewSite.domain.author.entity.AuthorInfo;
import com.example.WebNovelReviewSite.domain.novel.entity.Collection;
import com.example.WebNovelReviewSite.domain.review.entity.Review;
import com.example.WebNovelReviewSite.domain.user.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "name",length = 20)
    private String name;

    @Column(name = "id",length = 20)
    private String id;

    @Column(name = "passwd",length = 20)
    private String passwd;

    @Column(name = "nickname",length = 20)
    private String nickname;

    @Column(name = "email",length = 254)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name ="role")
    private Role role;

    //user - follow
    @OneToMany(mappedBy = "follower")
    private Set<Follow> followings = new HashSet<>();

    //user - follow
    @OneToMany(mappedBy = "target")
    private Set<Follow> followers = new HashSet<>();

    //user - author_info
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AuthorInfo authorInfo;

    //user - collection
    @OneToMany(mappedBy = "user")
    private List<Collection> collections = new ArrayList<>();

    //user - review
    @OneToMany(mappedBy = "user")
    private List<Review> reviews = new ArrayList<>();

    //좋아요
    @ManyToMany(mappedBy = "userList")
    private List<Review> likeList = new ArrayList<>();
}
