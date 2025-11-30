package com.example.WebNovelReviewSite.domain.author.service;

import com.example.WebNovelReviewSite.domain.author.dto.AuthorRequestDTO;
import com.example.WebNovelReviewSite.domain.author.dto.AuthorResponseDTO;
import com.example.WebNovelReviewSite.domain.author.entity.AuthorInfo;
import com.example.WebNovelReviewSite.domain.author.repository.AuthorRepository;
import com.example.WebNovelReviewSite.domain.user.entity.User;
import com.example.WebNovelReviewSite.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final UserRepository userRepository;

    @Transactional
    public Long createAuthor(AuthorRequestDTO.AuthorCreateDto request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        AuthorInfo authorInfo = AuthorInfo.builder()
                .userId(user.getUserId())
                .user(user)
                .penName(request.getPenName())
                .nationality(request.getNationality())
                .debutYear(request.getDebutYear())
                .brief(request.getBrief())
                .profileImage(request.getProfileImage())
                .isConfirmed(false)
                .build();

        AuthorInfo saved = authorRepository.save(authorInfo);
        return saved.getUserId();
    }

    @Transactional
    public void updateAuthor(Long userId, AuthorRequestDTO.AuthorUpdateDto request) {
        AuthorInfo authorInfo = authorRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 작가 정보입니다."));

        if (request.getPenName() != null)
            authorInfo.setPenName(request.getPenName());
        if (request.getNationality() != null)
            authorInfo.setNationality(request.getNationality());
        if (request.getDebutYear() != null)
            authorInfo.setDebutYear(request.getDebutYear());
        if (request.getBrief() != null)
            authorInfo.setBrief(request.getBrief());
        if (request.getProfileImage() != null)
            authorInfo.setProfileImage(request.getProfileImage());
    }

    public AuthorResponseDTO.AuthorDetailDto getAuthor(Long userId) {
        AuthorInfo authorInfo = authorRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 작가 정보입니다."));

        return AuthorResponseDTO.AuthorDetailDto.builder()
                .userId(authorInfo.getUserId())
                .penName(authorInfo.getPenName())
                .nationality(authorInfo.getNationality())
                .debutYear(authorInfo.getDebutYear())
                .brief(authorInfo.getBrief())
                .profileImage(authorInfo.getProfileImage())
                .isConfirmed(authorInfo.getIsConfirmed())
                .build();
    }
    
    public java.util.List<AuthorResponseDTO.AuthorDetailDto> getAllAuthors() {
        return authorRepository.findAll().stream()
                .filter(AuthorInfo::getIsConfirmed) // 승인된 작가만
                .map(authorInfo -> AuthorResponseDTO.AuthorDetailDto.builder()
                        .userId(authorInfo.getUserId())
                        .penName(authorInfo.getPenName())
                        .nationality(authorInfo.getNationality())
                        .debutYear(authorInfo.getDebutYear())
                        .brief(authorInfo.getBrief())
                        .profileImage(authorInfo.getProfileImage())
                        .isConfirmed(authorInfo.getIsConfirmed())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }
}
