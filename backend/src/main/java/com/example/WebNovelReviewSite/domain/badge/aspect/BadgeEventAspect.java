package com.example.WebNovelReviewSite.domain.badge.aspect;

import com.example.WebNovelReviewSite.domain.badge.event.CollectionCreatedEvent;
import com.example.WebNovelReviewSite.domain.badge.event.FollowAddedEvent;
import com.example.WebNovelReviewSite.domain.badge.event.ReviewCreatedEvent;
import com.example.WebNovelReviewSite.domain.badge.event.ReviewLikedEvent;
import com.example.WebNovelReviewSite.domain.badge.event.UserLoggedInEvent;
import com.example.WebNovelReviewSite.domain.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class BadgeEventAspect {

    private final ApplicationEventPublisher eventPublisher;
    private final ReviewRepository reviewRepository;

    /**
     * ReviewService.createReview 메서드 실행 후 이벤트 발행
     */
    @AfterReturning(pointcut = "execution(* com.example.WebNovelReviewSite.domain.review.service.ReviewService.createReview(..))", returning = "result")
    public void afterReviewCreated(JoinPoint joinPoint, Object result) {
        try {
            Object[] args = joinPoint.getArgs();
            if (args.length > 0 && args[0] instanceof com.example.WebNovelReviewSite.domain.review.dto.ReviewRequestDTO.ReviewCreateDto) {
                com.example.WebNovelReviewSite.domain.review.dto.ReviewRequestDTO.ReviewCreateDto request = 
                    (com.example.WebNovelReviewSite.domain.review.dto.ReviewRequestDTO.ReviewCreateDto) args[0];
                eventPublisher.publishEvent(new ReviewCreatedEvent(this, request.getUserId()));
                log.debug("리뷰 작성 이벤트 발행: userId={}", request.getUserId());
            }
        } catch (Exception e) {
            log.error("리뷰 작성 이벤트 발행 중 오류 발생", e);
        }
    }

    /**
     * ReviewService.addLike 메서드 실행 후 이벤트 발행
     */
    @AfterReturning(pointcut = "execution(* com.example.WebNovelReviewSite.domain.review.service.ReviewService.addLike(..))")
    public void afterReviewLiked(JoinPoint joinPoint) {
        try {
            Object[] args = joinPoint.getArgs();
            if (args.length >= 1 && args[0] instanceof Long) {
                Long reviewId = (Long) args[0];
                
                // join fetch를 사용하여 user를 함께 로드 (LazyInitializationException 방지)
                reviewRepository.findByIdWithUser(reviewId).ifPresent(review -> {
                    try {
                        Long reviewAuthorId = review.getUser().getUserId();
                        eventPublisher.publishEvent(new ReviewLikedEvent(this, reviewAuthorId));
                        log.info("리뷰 좋아요 이벤트 발행 성공: reviewId={}, reviewAuthorId={}", reviewId, reviewAuthorId);
                    } catch (Exception e) {
                        log.error("리뷰 좋아요 이벤트 발행 중 오류 발생: reviewId={}, reviewAuthorId={}", reviewId, e);
                    }
                });
            }
        } catch (Exception e) {
            log.error("리뷰 좋아요 이벤트 발행 중 전체 오류 발생", e);
        }
    }

    /**
     * CollectionService.createCollection 메서드 실행 후 이벤트 발행
     */
    @AfterReturning(pointcut = "execution(* com.example.WebNovelReviewSite.domain.novel.service.CollectionService.createCollection(..))", returning = "result")
    public void afterCollectionCreated(JoinPoint joinPoint, Object result) {
        try {
            Object[] args = joinPoint.getArgs();
            if (args.length > 0 && args[0] instanceof com.example.WebNovelReviewSite.domain.novel.dto.CollectionRequestDTO.CollectionCreateDto) {
                com.example.WebNovelReviewSite.domain.novel.dto.CollectionRequestDTO.CollectionCreateDto request = 
                    (com.example.WebNovelReviewSite.domain.novel.dto.CollectionRequestDTO.CollectionCreateDto) args[0];
                eventPublisher.publishEvent(new CollectionCreatedEvent(this, request.getUserId()));
                log.debug("컬렉션 생성 이벤트 발행: userId={}", request.getUserId());
            }
        } catch (Exception e) {
            log.error("컬렉션 생성 이벤트 발행 중 오류 발생", e);
        }
    }

    /**
     * FollowService.addFollow 메서드 실행 후 이벤트 발행
     * 팔로워 배지는 팔로우 받는 사람(targetId)에게 부여됨
     */
    @AfterReturning(pointcut = "execution(* com.example.WebNovelReviewSite.domain.user.service.FollowService.addFollow(..))")
    public void afterFollowAdded(JoinPoint joinPoint) {
        try {
            Object[] args = joinPoint.getArgs();
            if (args.length >= 2 && args[0] instanceof Long && args[1] instanceof Long) {
                Long followerId = (Long) args[0];  // 팔로우 하는 사람
                Long targetId = (Long) args[1];    // 팔로우 받는 사람
                eventPublisher.publishEvent(new FollowAddedEvent(this, followerId, targetId));
                log.debug("팔로우 추가 이벤트 발행: followerId={}, targetId={}", followerId, targetId);
            }
        } catch (Exception e) {
            log.error("팔로우 추가 이벤트 발행 중 오류 발생", e);
        }
    }

    /**
     * UserService.login 메서드 실행 후 이벤트 발행
     */
    @AfterReturning(pointcut = "execution(* com.example.WebNovelReviewSite.domain.user.service.UserService.login(..))", returning = "result")
    public void afterUserLoggedIn(JoinPoint joinPoint, Object result) {
        try {
            if (result instanceof Long) {
                Long userId = (Long) result;
                eventPublisher.publishEvent(new UserLoggedInEvent(this, userId));
                log.debug("로그인 이벤트 발행: userId={}", userId);
            }
        } catch (Exception e) {
            log.error("로그인 이벤트 발행 중 오류 발생", e);
        }
    }
}

