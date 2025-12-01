package com.example.WebNovelReviewSite.domain.review.service;

import com.example.WebNovelReviewSite.domain.hashtag.entity.Hashtag;
import com.example.WebNovelReviewSite.domain.hashtag.repository.HashtagRepository;
import com.example.WebNovelReviewSite.domain.novel.entity.Novel;
import com.example.WebNovelReviewSite.domain.novel.repository.NovelRepository;
import com.example.WebNovelReviewSite.domain.review.dto.ReviewRequestDTO;
import com.example.WebNovelReviewSite.domain.review.dto.ReviewResponseDTO;
import com.example.WebNovelReviewSite.domain.review.entity.Review;
import com.example.WebNovelReviewSite.domain.review.entity.ReviewHashtag;
import com.example.WebNovelReviewSite.domain.review.repository.ReviewHashtagRepository;
import com.example.WebNovelReviewSite.domain.review.repository.ReviewRepository;
import com.example.WebNovelReviewSite.domain.user.entity.User;
import com.example.WebNovelReviewSite.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final NovelRepository novelRepository;
    private final HashtagRepository hashtagRepository;
    private final ReviewHashtagRepository reviewHashtagRepository;

    @Transactional
    public Long createReview(ReviewRequestDTO.ReviewCreateDto request) {
        // Check duplicate review
        if (reviewRepository.existsByUser_UserIdAndNovel_NovelId(request.getUserId(), request.getNovelId())) {
            throw new IllegalArgumentException("이미 해당 작품에 리뷰를 작성했습니다.");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        Novel novel = novelRepository.findById(request.getNovelId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 작품입니다."));

        Review review = Review.builder()
                .user(user)
                .novel(novel)
                .content(request.getContent())
                .star(request.getStar())
                .views(0L)
                .userList(new ArrayList<>())
                .build();

        Review savedReview = reviewRepository.save(review);
        
        // 해시태그 처리
        if (request.getHashtags() != null && !request.getHashtags().isEmpty()) {
            saveReviewHashtags(savedReview.getReviewId(), request.getHashtags());
        }
        
        // 배지 이벤트는 BadgeEventAspect에서 AOP로 발행됨
        
        return savedReview.getReviewId();
    }

    @Transactional
    public void updateReview(Long reviewId, ReviewRequestDTO.ReviewUpdateDto request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다."));

        if (request.getContent() != null)
            review.setContent(request.getContent());
        if (request.getStar() != null)
            review.setStar(request.getStar());
        
        // 해시태그 업데이트
        if (request.getHashtags() != null) {
            reviewHashtagRepository.deleteByReviewId(reviewId);
            if (!request.getHashtags().isEmpty()) {
                saveReviewHashtags(reviewId, request.getHashtags());
            }
        }
    }
    
    private void saveReviewHashtags(Long reviewId, List<String> hashtagNames) {
        for (String hashtagName : hashtagNames) {
            if (hashtagName == null || hashtagName.trim().isEmpty()) {
                continue;
            }
            
            Hashtag hashtag = hashtagRepository.findByHashtagName(hashtagName.trim())
                    .orElseGet(() -> {
                        Hashtag newHashtag = Hashtag.builder()
                                .hashtagName(hashtagName.trim())
                                .build();
                        return hashtagRepository.save(newHashtag);
                    });
            
            ReviewHashtag reviewHashtag = ReviewHashtag.builder()
                    .reviewId(reviewId)
                    .hashtagId(hashtag.getHashtagId())
                    .build();
            
            reviewHashtagRepository.save(reviewHashtag);
        }
    }
    
    private List<String> getHashtagNames(Review review) {
        // Repository를 사용하여 직접 조회 (더 안전함)
        List<ReviewHashtag> reviewHashtags = reviewHashtagRepository.findByReviewId(review.getReviewId());
        if (reviewHashtags == null || reviewHashtags.isEmpty()) {
            return new ArrayList<>();
        }
        return reviewHashtags.stream()
                .map(rh -> rh.getHashtag().getHashtagName())
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다."));
        reviewRepository.delete(review);
    }

    public List<ReviewResponseDTO.ReviewDetailDto> getReviewsByNovel(Long novelId) {
        List<Review> reviews = reviewRepository.findByNovel_NovelId(novelId);

        return reviews.stream()
                .map(review -> ReviewResponseDTO.ReviewDetailDto.builder()
                        .reviewId(review.getReviewId())
                        .userId(review.getUser().getUserId())
                        .userName(review.getUser().getName())
                        .novelId(review.getNovel().getNovelId())
                        .novelName(review.getNovel().getNovelName())
                        .content(review.getContent())
                        .star(review.getStar())
                        .views(review.getViews())
                        .likeCount((long) review.getUserList().size())
                        .hashtags(getHashtagNames(review))
                        .build())
                .collect(Collectors.toList());
    }

    public ReviewResponseDTO.ReviewDetailDto getReview(Long reviewId) {
        Review review = reviewRepository.findByIdWithUser(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다."));

        return ReviewResponseDTO.ReviewDetailDto.builder()
                .reviewId(review.getReviewId())
                .userId(review.getUser().getUserId())
                .userName(review.getUser().getName())
                .novelId(review.getNovel().getNovelId())
                .novelName(review.getNovel().getNovelName())
                .content(review.getContent())
                .star(review.getStar())
                .views(review.getViews())
                .likeCount((long) review.getUserList().size())
                .hashtags(getHashtagNames(review))
                .build();
    }

    @Transactional
    public void addLike(Long reviewId, Long userId) {
        Review review = reviewRepository.findByIdWithUser(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (review.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("자신의 리뷰에는 좋아요를 할 수 없습니다.");
        }

        if (review.getUserList().contains(user)) {
            throw new IllegalArgumentException("이미 좋아요를 누른 리뷰입니다.");
        }

        review.getUserList().add(user);
        
        // 배지 이벤트는 BadgeEventAspect에서 AOP로 발행됨
    }

    @Transactional
    public void removeLike(Long reviewId, Long userId) {
        Review review = reviewRepository.findByIdWithUser(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (!review.getUserList().contains(user)) {
            throw new IllegalArgumentException("좋아요를 누르지 않은 리뷰입니다.");
        }

        review.getUserList().remove(user);
    }
    
    public List<ReviewResponseDTO.ReviewDetailDto> getReviewsByUser(Long userId) {
        List<Review> reviews = reviewRepository.findByUser_UserId(userId);

        return reviews.stream()
                .map(review -> ReviewResponseDTO.ReviewDetailDto.builder()
                        .reviewId(review.getReviewId())
                        .userId(review.getUser().getUserId())
                        .userName(review.getUser().getName())
                        .novelId(review.getNovel().getNovelId())
                        .novelName(review.getNovel().getNovelName())
                        .content(review.getContent())
                        .star(review.getStar())
                        .views(review.getViews())
                        .likeCount((long) review.getUserList().size())
                        .hashtags(getHashtagNames(review))
                        .build())
                .collect(Collectors.toList());
    }
    
    public List<ReviewResponseDTO.ReviewDetailDto> getAllReviews() {
        List<Review> reviews = reviewRepository.findAllOrderByReviewIdDesc();

        return reviews.stream()
                .map(review -> ReviewResponseDTO.ReviewDetailDto.builder()
                        .reviewId(review.getReviewId())
                        .userId(review.getUser().getUserId())
                        .userName(review.getUser().getName())
                        .novelId(review.getNovel().getNovelId())
                        .novelName(review.getNovel().getNovelName())
                        .content(review.getContent())
                        .star(review.getStar())
                        .views(review.getViews())
                        .likeCount((long) review.getUserList().size())
                        .hashtags(getHashtagNames(review))
                        .build())
                .collect(Collectors.toList());
    }
}
