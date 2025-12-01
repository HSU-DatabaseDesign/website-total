package com.example.WebNovelReviewSite.domain.author.entity;

import com.example.WebNovelReviewSite.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "author_info")
public class AuthorInfo {
    
    // @MapsId를 사용하기 위한 팩토리 메서드
    // @MapsId는 user의 ID를 userId에 자동으로 매핑하지만, 
    // 명시적으로 userId를 설정하는 것이 더 안전합니다.
    public static AuthorInfo create(User user, String penName, String nationality, 
                                    String debutYear, String brief, String profileImage, Boolean isConfirmed) {
        if (user == null || user.getUserId() == null) {
            throw new IllegalArgumentException("User와 User ID는 필수입니다.");
        }
        AuthorInfo authorInfo = new AuthorInfo();
        authorInfo.setUserId(user.getUserId()); // 명시적으로 userId 설정
        authorInfo.setUser(user);
        authorInfo.setPenName(penName);
        authorInfo.setNationality(nationality);
        authorInfo.setDebutYear(debutYear);
        authorInfo.setBrief(brief);
        authorInfo.setProfileImage(profileImage);
        authorInfo.setIsConfirmed(isConfirmed);
        return authorInfo;
    }

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId// 유저 키가 FK이면서 PK인 경우, 속성이 같아서 안써도 된다.
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "pen_name", length = 20)
    private String penName;

    @Column(name = "nationality", length = 20)
    private String nationality;

    @Column(name = "debut_year", length = 4)
    private String debutYear;

    @Column(name = "brief", length = 255)
    private String brief;

    @Column(name = "profile_image", length = 255)
    private String profileImage;

    @Column(name = "is_confirmed")
    private Boolean isConfirmed;

}
