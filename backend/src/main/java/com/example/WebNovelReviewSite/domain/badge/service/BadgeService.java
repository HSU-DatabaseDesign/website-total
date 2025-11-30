package com.example.WebNovelReviewSite.domain.badge.service;

import com.example.WebNovelReviewSite.domain.badge.dto.BadgeRequestDTO;
import com.example.WebNovelReviewSite.domain.badge.dto.BadgeResponseDTO;
import com.example.WebNovelReviewSite.domain.badge.entity.Badge;
import com.example.WebNovelReviewSite.domain.badge.entity.UserBadge;
import com.example.WebNovelReviewSite.domain.badge.entity.UserBadgeId;
import com.example.WebNovelReviewSite.domain.badge.enums.BadgeType;
import com.example.WebNovelReviewSite.domain.badge.repository.BadgeRepository;
import com.example.WebNovelReviewSite.domain.badge.repository.UserBadgeRepository;
import com.example.WebNovelReviewSite.domain.novel.repository.CollectionRepository;
import com.example.WebNovelReviewSite.domain.review.entity.Review;
import com.example.WebNovelReviewSite.domain.review.repository.ReviewRepository;
import com.example.WebNovelReviewSite.domain.user.entity.User;
import com.example.WebNovelReviewSite.domain.user.repository.FollowRepository;
import com.example.WebNovelReviewSite.domain.user.repository.LoginHistoryRepository;
import com.example.WebNovelReviewSite.domain.user.repository.UserRepository;
import com.example.WebNovelReviewSite.domain.user.entity.LoginHistory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final CollectionRepository collectionRepository;
    private final FollowRepository followRepository;
    private final LoginHistoryRepository loginHistoryRepository;

    @Transactional
    public Long createBadge(BadgeRequestDTO.BadgeCreateDto request) {
        // 중복 체크
        if (badgeRepository.findByBadgeName(request.getBadgeName()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 뱃지명입니다.");
        }

        // LOGIN_DAYS 타입은 conditionValue가 없어도 됨
        if (request.getBadgeType() != BadgeType.LOGIN_DAYS && request.getConditionValue() == null && 
            (request.getStartDate() == null || request.getEndDate() == null)) {
            throw new IllegalArgumentException("LOGIN_DAYS가 아닌 경우 conditionValue 또는 (startDate와 endDate) 중 하나는 필수입니다.");
        }

        Badge badge = Badge.builder()
                .badgeName(request.getBadgeName())
                .badgeImage(request.getBadgeImage())
                .badgeType(request.getBadgeType())
                .badgeMission(request.getBadgeMission())
                .conditionValue(request.getConditionValue())
                .startDate(request.getStartDate() != null ? request.getStartDate() : LocalDateTime.now())
                .endDate(request.getEndDate())
                .userBadges(List.of())
                .build();

        Badge savedBadge = badgeRepository.save(badge);
        return savedBadge.getBadgeId();
    }

    public BadgeResponseDTO.BadgeDetailDto getBadge(Long badgeId) {
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 뱃지입니다."));

        return BadgeResponseDTO.BadgeDetailDto.builder()
                .badgeId(badge.getBadgeId())
                .badgeName(badge.getBadgeName())
                .badgeImage(badge.getBadgeImage())
                .badgeType(badge.getBadgeType())
                .badgeMission(badge.getBadgeMission())
                .conditionValue(badge.getConditionValue())
                .startDate(badge.getStartDate())
                .endDate(badge.getEndDate())
                .build();
    }

    public List<BadgeResponseDTO.BadgeDetailDto> getAllBadges() {
        List<Badge> badges = badgeRepository.findAll();
        return badges.stream()
                .map(badge -> BadgeResponseDTO.BadgeDetailDto.builder()
                        .badgeId(badge.getBadgeId())
                        .badgeName(badge.getBadgeName())
                        .badgeImage(badge.getBadgeImage())
                        .badgeType(badge.getBadgeType())
                        .badgeMission(badge.getBadgeMission())
                        .conditionValue(badge.getConditionValue())
                        .startDate(badge.getStartDate())
                        .endDate(badge.getEndDate())
                        .build())
                .collect(Collectors.toList());
    }

    public List<BadgeResponseDTO.BadgeDetailDto> getActiveBadges() {
        List<Badge> badges = badgeRepository.findActiveBadges(LocalDateTime.now());
        return badges.stream()
                .map(badge -> BadgeResponseDTO.BadgeDetailDto.builder()
                        .badgeId(badge.getBadgeId())
                        .badgeName(badge.getBadgeName())
                        .badgeImage(badge.getBadgeImage())
                        .badgeType(badge.getBadgeType())
                        .badgeMission(badge.getBadgeMission())
                        .conditionValue(badge.getConditionValue())
                        .startDate(badge.getStartDate())
                        .endDate(badge.getEndDate())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateBadge(Long badgeId, BadgeRequestDTO.BadgeUpdateDto request) {
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 뱃지입니다."));

        if (request.getBadgeName() != null)
            badge.setBadgeName(request.getBadgeName());
        if (request.getBadgeImage() != null)
            badge.setBadgeImage(request.getBadgeImage());
        if (request.getBadgeType() != null)
            badge.setBadgeType(request.getBadgeType());
        if (request.getBadgeMission() != null)
            badge.setBadgeMission(request.getBadgeMission());
        if (request.getConditionValue() != null)
            badge.setConditionValue(request.getConditionValue());
        if (request.getStartDate() != null)
            badge.setStartDate(request.getStartDate());
        if (request.getEndDate() != null)
            badge.setEndDate(request.getEndDate());
    }

    @Transactional
    public void deleteBadge(Long badgeId) {
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 뱃지입니다."));
        badgeRepository.delete(badge);
    }

    @Transactional
    public void assignBadgeToUser(Long userId, Long badgeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 뱃지입니다."));

        // 이미 보유한 뱃지인지 확인
        if (userBadgeRepository.existsByUserIdAndBadgeId(userId, badgeId)) {
            throw new IllegalArgumentException("이미 보유한 뱃지입니다.");
        }

        // 활성 뱃지인지 확인
        LocalDateTime now = LocalDateTime.now();
        if (badge.getStartDate() != null && badge.getStartDate().isAfter(now)) {
            throw new IllegalArgumentException("아직 시작되지 않은 뱃지입니다.");
        }
        if (badge.getEndDate() != null && badge.getEndDate().isBefore(now)) {
            throw new IllegalArgumentException("이미 종료된 뱃지입니다.");
        }

        UserBadgeId userBadgeId = new UserBadgeId(userId, badgeId);
        UserBadge userBadge = UserBadge.builder()
                .id(userBadgeId)
                .user(user)
                .badge(badge)
                .build();

        userBadgeRepository.save(userBadge);
    }

    /**
     * 자동 뱃지 부여용 내부 메서드 (예외를 던지지 않음)
     */
    @Transactional
    private void assignBadgeToUserInternal(Long userId, Long badgeId) {
        try {
            // 이미 보유한 뱃지인지 확인
            if (userBadgeRepository.existsByUserIdAndBadgeId(userId, badgeId)) {
                return; // 이미 보유한 경우 그냥 리턴
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
            Badge badge = badgeRepository.findById(badgeId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 뱃지입니다."));

            // 활성 뱃지인지 확인
            LocalDateTime now = LocalDateTime.now();
            if (badge.getStartDate() != null && badge.getStartDate().isAfter(now)) {
                return; // 아직 시작되지 않은 뱃지
            }
            if (badge.getEndDate() != null && badge.getEndDate().isBefore(now)) {
                return; // 이미 종료된 뱃지
            }

            UserBadgeId userBadgeId = new UserBadgeId(userId, badgeId);
            UserBadge userBadge = UserBadge.builder()
                    .id(userBadgeId)
                    .user(user)
                    .badge(badge)
                    .build();

            userBadgeRepository.save(userBadge);
        } catch (Exception e) {
            log.error("뱃지 자동 부여 중 오류 발생: userId={}, badgeId={}", userId, badgeId, e);
        }
    }

    @Transactional
    public void removeBadgeFromUser(Long userId, Long badgeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 뱃지입니다."));

        UserBadge userBadge = userBadgeRepository.findByUserAndBadge(user, badge)
                .orElseThrow(() -> new IllegalArgumentException("보유하지 않은 뱃지입니다."));

        userBadgeRepository.delete(userBadge);
    }

    public BadgeResponseDTO.UserBadgeListDto getUserBadges(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        List<UserBadge> userBadges = userBadgeRepository.findByUser(user);
        List<BadgeResponseDTO.UserBadgeDto> badgeDtos = userBadges.stream()
                .map(ub -> BadgeResponseDTO.UserBadgeDto.builder()
                        .userId(ub.getUser().getUserId())
                        .badgeId(ub.getBadge().getBadgeId())
                        .badgeName(ub.getBadge().getBadgeName())
                        .badgeImage(ub.getBadge().getBadgeImage())
                        .badgeType(ub.getBadge().getBadgeType())
                        .badgeMission(ub.getBadge().getBadgeMission())
                        .conditionValue(ub.getBadge().getConditionValue())
                        .build())
                .collect(Collectors.toList());

        return BadgeResponseDTO.UserBadgeListDto.of(userId, badgeDtos);
    }

    /**
     * 리뷰 작성 후 자동 뱃지 체크
     * 리뷰 작성 개수에 따라 뱃지를 자동으로 부여합니다.
     */
    @Transactional
    public void checkAndAssignReviewCountBadge(Long userId) {
        try {
            // 사용자의 리뷰 개수 조회
            // TODO: 성능 최적화를 위해 ReviewRepository에 countByUser_UserId 메서드 추가 고려
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
            long reviewCount = user.getReviews() != null ? user.getReviews().size() : 0;

            // 활성화된 REVIEW_COUNT 타입 뱃지 조회
            LocalDateTime now = LocalDateTime.now();
            List<Badge> activeReviewBadges = badgeRepository.findActiveBadgesByType(BadgeType.REVIEW_COUNT, now);

            // 조건을 만족하는 뱃지 자동 부여
            for (Badge badge : activeReviewBadges) {
                if (reviewCount >= badge.getConditionValue()) {
                    assignBadgeToUserInternal(userId, badge.getBadgeId());
                    log.info("뱃지 자동 부여: userId={}, badgeId={}, badgeName={}", userId, badge.getBadgeId(), badge.getBadgeName());
                }
            }
        } catch (Exception e) {
            log.error("리뷰 개수 뱃지 체크 중 오류 발생: userId={}", userId, e);
        }
    }

    /**
     * 컬렉션 생성 후 자동 뱃지 체크
     * 컬렉션 생성 개수에 따라 뱃지를 자동으로 부여합니다.
     */
    @Transactional
    public void checkAndAssignCollectionCountBadge(Long userId) {
        try {
            // 사용자의 컬렉션 개수 조회
            long collectionCount = collectionRepository.findByUser_UserId(userId).size();

            // 활성화된 COLLECTION_COUNT 타입 뱃지 조회
            LocalDateTime now = LocalDateTime.now();
            List<Badge> activeCollectionBadges = badgeRepository.findActiveBadgesByType(BadgeType.COLLECTION_COUNT, now);

            // 조건을 만족하는 뱃지 자동 부여
            for (Badge badge : activeCollectionBadges) {
                if (collectionCount >= badge.getConditionValue()) {
                    assignBadgeToUserInternal(userId, badge.getBadgeId());
                    log.info("뱃지 자동 부여: userId={}, badgeId={}, badgeName={}", userId, badge.getBadgeId(), badge.getBadgeName());
                }
            }
        } catch (Exception e) {
            log.error("컬렉션 개수 뱃지 체크 중 오류 발생: userId={}", userId, e);
        }
    }

    /**
     * 팔로우 추가 후 자동 뱃지 체크
     * 팔로워 수(나를 팔로우하는 사람 수)에 따라 뱃지를 자동으로 부여합니다.
     */
    @Transactional
    public void checkAndAssignFollowCountBadge(Long userId) {
        try {
            // 사용자의 팔로워 수 조회 (나를 팔로우하는 사람 수)
            long followerCount = followRepository.findByTarget_UserId(userId).size();

            // 활성화된 FOLLOW_COUNT 타입 뱃지 조회
            LocalDateTime now = LocalDateTime.now();
            List<Badge> activeFollowBadges = badgeRepository.findActiveBadgesByType(BadgeType.FOLLOW_COUNT, now);

            // 조건을 만족하는 뱃지 자동 부여
            for (Badge badge : activeFollowBadges) {
                if (followerCount >= badge.getConditionValue()) {
                    assignBadgeToUserInternal(userId, badge.getBadgeId());
                    log.info("뱃지 자동 부여: userId={}, badgeId={}, badgeName={}", userId, badge.getBadgeId(), badge.getBadgeName());
                }
            }
        } catch (Exception e) {
            log.error("팔로워 수 뱃지 체크 중 오류 발생: userId={}", userId, e);
        }
    }

    /**
     * 리뷰 좋아요 추가 후 자동 뱃지 체크
     * 리뷰 작성자가 받은 총 좋아요 개수에 따라 뱃지를 자동으로 부여합니다.
     */
    @Transactional
    public void checkAndAssignLikeCountBadge(Long reviewAuthorId) {
        try {
            // 리뷰 작성자가 받은 총 좋아요 개수 조회
            long totalLikeCount = reviewRepository.findAll().stream()
                    .filter(review -> review.getUser().getUserId().equals(reviewAuthorId))
                    .mapToLong(review -> review.getUserList().size())
                    .sum();

            // 활성화된 LIKE_COUNT 타입 뱃지 조회
            LocalDateTime now = LocalDateTime.now();
            List<Badge> activeLikeBadges = badgeRepository.findActiveBadgesByType(BadgeType.LIKE_COUNT, now);

            // 조건을 만족하는 뱃지 자동 부여
            for (Badge badge : activeLikeBadges) {
                if (badge.getConditionValue() == null) {
                    continue; // conditionValue가 없으면 스킵
                }
                
                if (totalLikeCount >= badge.getConditionValue()) {
                    assignBadgeToUserInternal(reviewAuthorId, badge.getBadgeId());
                    log.info("뱃지 자동 부여: userId={}, badgeId={}, badgeName={}, totalLikeCount={}, conditionValue={}", 
                            reviewAuthorId, badge.getBadgeId(), badge.getBadgeName(), totalLikeCount, badge.getConditionValue());
                }
            }
        } catch (Exception e) {
            log.error("좋아요 개수 뱃지 체크 중 오류 발생: reviewAuthorId={}", reviewAuthorId, e);
        }
    }

    /**
     * 로그인 시 자동 뱃지 체크
     * 출석 일수를 기록하고 조건을 만족하면 배지를 자동으로 부여합니다.
     */
    @Transactional
    public void checkAndAssignLoginDaysBadge(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
            
            LocalDate today = LocalDate.now();
            
            // 오늘 이미 출석 기록이 있는지 확인
            if (!loginHistoryRepository.existsByUserAndLoginDate(user, today)) {
                // 오늘 출석 기록 추가
                LoginHistory loginHistory = LoginHistory.builder()
                        .user(user)
                        .loginDate(today)
                        .build();
                loginHistoryRepository.save(loginHistory);
                log.info("출석 기록 추가: userId={}, date={}", userId, today);
            }
            
            // 총 출석 일수 조회
            long loginDays = loginHistoryRepository.countByUserId(userId);
            log.info("사용자 총 출석 일수: userId={}, loginDays={}", userId, loginDays);
            
            // 활성화된 LOGIN_DAYS 타입 뱃지 조회
            LocalDateTime now = LocalDateTime.now();
            List<Badge> activeLoginBadges = badgeRepository.findActiveBadgesByType(BadgeType.LOGIN_DAYS, now);
            
            // 조건을 만족하는 뱃지 자동 부여
            for (Badge badge : activeLoginBadges) {
                if (badge.getConditionValue() != null && loginDays >= badge.getConditionValue()) {
                    assignBadgeToUserInternal(userId, badge.getBadgeId());
                    log.info("출석 뱃지 자동 부여: userId={}, badgeId={}, badgeName={}, loginDays={}", 
                            userId, badge.getBadgeId(), badge.getBadgeName(), loginDays);
                }
            }
        } catch (Exception e) {
            log.error("출석 뱃지 체크 중 오류 발생: userId={}", userId, e);
        }
    }

    /**
     * 특정 타입의 뱃지를 체크하고 자동으로 부여하는 통합 메서드
     */
    @Transactional
    public void checkAndAssignBadgeByType(Long userId, BadgeType badgeType) {
        switch (badgeType) {
            case REVIEW_COUNT:
                checkAndAssignReviewCountBadge(userId);
                break;
            case COLLECTION_COUNT:
                checkAndAssignCollectionCountBadge(userId);
                break;
            case FOLLOW_COUNT:
                checkAndAssignFollowCountBadge(userId);
                break;
            case LIKE_COUNT:
                checkAndAssignLikeCountBadge(userId);
                break;
            case LOGIN_DAYS:
                checkAndAssignLoginDaysBadge(userId);
                break;
        }
    }

    /**
     * 사용자의 모든 배지 진행률 조회
     * 모든 배지와 사용자의 현재 진행률을 함께 반환합니다.
     * 조건을 만족하면 자동으로 배지를 부여합니다.
     */
    @Transactional
    public BadgeResponseDTO.UserBadgeProgressListDto getUserBadgeProgress(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 사용자의 현재 진행률 계산
        int reviewCount = user.getReviews() != null ? user.getReviews().size() : 0;
        int collectionCount = (int) collectionRepository.findByUser_UserId(userId).size();
        int followerCount = (int) followRepository.findByTarget_UserId(userId).size(); // 나를 팔로우하는 사람 수
        int likeCount = (int) reviewRepository.findAll().stream()
                .filter(review -> review.getUser().getUserId().equals(userId))
                .mapToLong(review -> review.getUserList().size())
                .sum();
        int loginDays = (int) loginHistoryRepository.countByUserId(userId);

        log.info("배지 진행률 조회: userId={}, reviewCount={}, collectionCount={}, followerCount={}, likeCount={}, loginDays={}",
                userId, reviewCount, collectionCount, followerCount, likeCount, loginDays);

        // 모든 배지 조회
        List<Badge> allBadges = badgeRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        // 조건을 만족하는 배지 자동 부여
        for (Badge badge : allBadges) {
            if (badge.getConditionValue() == null) continue;
            
            int currentValue = getCurrentValueByType(badge.getBadgeType(), reviewCount, collectionCount, followerCount, likeCount, loginDays);
            
            // 조건 만족 시 배지 부여
            if (currentValue >= badge.getConditionValue()) {
                // 이미 보유한 배지인지 확인
                if (!userBadgeRepository.existsByUserIdAndBadgeId(userId, badge.getBadgeId())) {
                    // 활성 배지인지 확인
                    if ((badge.getStartDate() == null || !badge.getStartDate().isAfter(now)) &&
                        (badge.getEndDate() == null || !badge.getEndDate().isBefore(now))) {
                        
                        UserBadgeId userBadgeId = new UserBadgeId(userId, badge.getBadgeId());
                        UserBadge userBadge = UserBadge.builder()
                                .id(userBadgeId)
                                .user(user)
                                .badge(badge)
                                .build();
                        userBadgeRepository.save(userBadge);
                        log.info("배지 자동 부여 (진행률 조회 시): userId={}, badgeId={}, badgeName={}", 
                                userId, badge.getBadgeId(), badge.getBadgeName());
                    }
                }
            }
        }

        // 사용자가 보유한 배지 ID 목록 (배지 부여 후 다시 조회)
        List<Long> userBadgeIds = userBadgeRepository.findByUser(user).stream()
                .map(ub -> ub.getBadge().getBadgeId())
                .collect(Collectors.toList());

        log.info("사용자 보유 배지 ID 목록: userId={}, badgeIds={}", userId, userBadgeIds);

        // 진행률 계산
        List<BadgeResponseDTO.BadgeProgressDto> progressList = allBadges.stream()
                .map(badge -> {
                    int currentValue = getCurrentValueByType(badge.getBadgeType(), reviewCount, collectionCount, followerCount, likeCount, loginDays);
                    boolean isUnlocked = userBadgeIds.contains(badge.getBadgeId());
                    
                    return BadgeResponseDTO.BadgeProgressDto.builder()
                            .badgeId(badge.getBadgeId())
                            .badgeName(badge.getBadgeName())
                            .badgeImage(badge.getBadgeImage())
                            .badgeType(badge.getBadgeType())
                            .badgeMission(badge.getBadgeMission())
                            .conditionValue(badge.getConditionValue())
                            .currentValue(currentValue)
                            .unlocked(isUnlocked)
                            .build();
                })
                .collect(Collectors.toList());

        return BadgeResponseDTO.UserBadgeProgressListDto.of(userId, progressList);
    }

    /**
     * 배지 타입에 따른 현재 값 반환
     */
    private int getCurrentValueByType(BadgeType badgeType, int reviewCount, int collectionCount, int followCount, int likeCount, int loginDays) {
        switch (badgeType) {
            case REVIEW_COUNT:
                return reviewCount;
            case COLLECTION_COUNT:
                return collectionCount;
            case FOLLOW_COUNT:
                return followCount;
            case LIKE_COUNT:
                return likeCount;
            case LOGIN_DAYS:
                return loginDays;
            case SPECIAL:
            case EVENT:
            default:
                return 0;
        }
    }
}

