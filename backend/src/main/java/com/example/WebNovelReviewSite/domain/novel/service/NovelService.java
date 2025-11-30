package com.example.WebNovelReviewSite.domain.novel.service;

import com.example.WebNovelReviewSite.domain.novel.dto.NovelResponseDTO;
import com.example.WebNovelReviewSite.domain.novel.entity.Novel;
import com.example.WebNovelReviewSite.domain.novel.enums.Genre;
import com.example.WebNovelReviewSite.domain.novel.repository.NovelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NovelService {

    private final NovelRepository novelRepository;

    public List<NovelResponseDTO.NovelDetailDto> getAllNovels() {
        return novelRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public NovelResponseDTO.NovelDetailDto getNovel(Long novelId) {
        Novel novel = novelRepository.findById(novelId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 작품입니다."));
        return convertToDto(novel);
    }

    public List<NovelResponseDTO.NovelDetailDto> getNovelsByGenre(Genre genre) {
        return novelRepository.findByGenre(genre).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<NovelResponseDTO.NovelDetailDto> searchNovels(String keyword) {
        return novelRepository.findByNovelNameContainingOrNovelAuthorContaining(keyword, keyword).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private NovelResponseDTO.NovelDetailDto convertToDto(Novel novel) {
        double averageRating = novel.getReviews().isEmpty() ? 0.0
                : novel.getReviews().stream()
                        .map(review -> review.getStar().doubleValue())
                        .mapToDouble(Double::doubleValue)
                        .average()
                        .orElse(0.0);

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
                .reviewCount((long) novel.getReviews().size())
                .build();
    }
}
