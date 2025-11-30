package com.example.WebNovelReviewSite.domain.badge.entity;

import com.example.WebNovelReviewSite.domain.badge.enums.BadgeType;
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
@Table(name = "badge")
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "badge_id")
    private Long badgeId;

    @Column(name = "badge_name", length = 20)
    private String badgeName;

    @Column(name = "badge_image", length = 255)
    private String badgeImage;

    @Enumerated(EnumType.STRING)
    @Column(name = "badge_type")
    private BadgeType badgeType;

    @Column(name = "badge_mission", length = 30)
    private String badgeMission;

    @Column(name = "condition_value")
    private Integer conditionValue;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    //badge - user_badge
    @OneToMany(mappedBy = "badge", fetch = FetchType.LAZY)
    private List<UserBadge> userBadges = new ArrayList<>();
}

