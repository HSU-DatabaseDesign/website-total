package com.example.WebNovelReviewSite.domain.author.service;

import com.example.WebNovelReviewSite.domain.author.dto.AuthorRequestDTO;
import com.example.WebNovelReviewSite.domain.author.dto.AuthorResponseDTO;
import com.example.WebNovelReviewSite.domain.author.entity.AuthorInfo;
import com.example.WebNovelReviewSite.domain.author.repository.AuthorRepository;
import com.example.WebNovelReviewSite.domain.user.entity.User;
import com.example.WebNovelReviewSite.domain.user.enums.Role;
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

        // 이미 작가 신청이 있는지 확인
        if (authorRepository.existsById(request.getUserId())) {
            throw new IllegalArgumentException("이미 작가 신청이 존재합니다.");
        }

        // 필수 항목 검증 (이름, 활동명)
        if (request.getPenName() == null || request.getPenName().trim().isEmpty()) {
            throw new IllegalArgumentException("활동명은 필수입니다.");
        }
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("이름은 필수입니다.");
        }

        // @MapsId를 사용하므로 userId는 설정하지 않고 user만 설정
        // 팩토리 메서드를 사용하여 @MapsId가 제대로 작동하도록 함
        AuthorInfo authorInfo = AuthorInfo.create(
                user,
                request.getPenName(),
                request.getNationality(),
                request.getDebutYear(),
                request.getBrief(),
                request.getProfileImage(),
                false // isConfirmed
        );

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
        AuthorInfo authorInfo = authorRepository.findByIdWithUser(userId)
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

    // 관리자용: 승인 대기 중인 작가 목록 조회
    public java.util.List<AuthorResponseDTO.AuthorDetailDto> getPendingAuthors() {
        return authorRepository.findAllPending().stream()
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

    // 관리자용: 작가 승인
    @Transactional
    public void approveAuthor(Long userId) {
        AuthorInfo authorInfo = authorRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 작가 정보입니다."));

        if (authorInfo.getIsConfirmed()) {
            throw new IllegalArgumentException("이미 승인된 작가입니다.");
        }

        // 작가 승인 처리
        authorInfo.setIsConfirmed(true);

        // 사용자 역할을 AUTHOR로 변경
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        user.setRole(Role.AUTHOR);
    }
}
