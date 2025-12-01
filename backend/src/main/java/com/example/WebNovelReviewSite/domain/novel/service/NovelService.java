package com.example.WebNovelReviewSite.domain.novel.service;

import com.example.WebNovelReviewSite.domain.novel.dto.NovelResponseDTO;
import com.example.WebNovelReviewSite.domain.novel.entity.Novel;
import com.example.WebNovelReviewSite.domain.novel.entity.NovelHashtag;
import com.example.WebNovelReviewSite.domain.novel.enums.Genre;
import com.example.WebNovelReviewSite.domain.novel.repository.NovelHashtagRepository;
import com.example.WebNovelReviewSite.domain.novel.repository.NovelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NovelService {

    private final NovelRepository novelRepository;
    private final NovelHashtagRepository novelHashtagRepository;

    public List<NovelResponseDTO.NovelDetailDto> getAllNovels() {
        return novelRepository.findAllWithReviews().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public NovelResponseDTO.NovelDetailDto getNovel(Long novelId) {
        Novel novel = novelRepository.findByIdWithReviews(novelId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 작품입니다."));
        return convertToDto(novel);
    }

    public List<NovelResponseDTO.NovelDetailDto> getNovelsByGenre(Genre genre) {
        return novelRepository.findByGenreWithReviews(genre).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<NovelResponseDTO.NovelDetailDto> searchNovels(String keyword) {
        // 검색 결과도 reviews를 함께 가져오기 위해 findAllWithReviews를 사용
        List<Novel> allNovels = novelRepository.findAllWithReviews();
        return allNovels.stream()
                .filter(novel -> 
                    (novel.getNovelName() != null && novel.getNovelName().contains(keyword)) ||
                    (novel.getNovelAuthor() != null && novel.getNovelAuthor().contains(keyword))
                )
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private NovelResponseDTO.NovelDetailDto convertToDto(Novel novel) {
        // reviews가 null이거나 비어있을 수 있으므로 안전하게 처리
        List<com.example.WebNovelReviewSite.domain.review.entity.Review> reviews = novel.getReviews();
        if (reviews == null) {
            reviews = new java.util.ArrayList<>();
        }
        
        double averageRating = reviews.isEmpty() ? 0.0
                : reviews.stream()
                        .map(review -> review.getStar() != null ? review.getStar().doubleValue() : 0.0)
                        .mapToDouble(Double::doubleValue)
                        .average()
                        .orElse(0.0);

        // 해시태그 가져오기
        List<String> hashtags = novelHashtagRepository.findByNovelId(novel.getNovelId()).stream()
                .map(nh -> nh.getHashtag().getHashtagName())
                .collect(Collectors.toList());
        
        return NovelResponseDTO.NovelDetailDto.builder()
                .novelId(novel.getNovelId())
                .novelName(novel.getNovelName())
                .novelAuthor(novel.getNovelAuthor())
                .novelContext(novel.getNovelContext())
                .genre(novel.getGenre())
                .restricted(novel.getRestricted())
                .novelStatus(novel.getNovelStatus())
                .platform(novel.getPlatform())
                .registrationDate(novel.getRegistrationDate())
                .averageRating(averageRating)
                .reviewCount((long) reviews.size())
                .hashtags(hashtags)
                .build();
    }
}
