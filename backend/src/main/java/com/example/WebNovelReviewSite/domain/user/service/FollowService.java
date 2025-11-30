package com.example.WebNovelReviewSite.domain.user.service;

import com.example.WebNovelReviewSite.domain.user.dto.FollowResponseDTO;
import com.example.WebNovelReviewSite.domain.user.entity.Follow;
import com.example.WebNovelReviewSite.domain.user.entity.FollowId;
import com.example.WebNovelReviewSite.domain.user.entity.User;
import com.example.WebNovelReviewSite.domain.user.repository.FollowRepository;
import com.example.WebNovelReviewSite.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @Transactional
    public void addFollow(Long followerId, Long targetId) {
        if (followerId.equals(targetId)) {
            throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        User target = userRepository.findById(targetId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        FollowId followId = new FollowId(followerId, targetId);
        Follow follow = new Follow(followId, follower, target);

        followRepository.save(follow);
        
        // 배지 이벤트는 BadgeEventAspect에서 AOP로 발행됨
    }

    @Transactional
    public void removeFollow(Long followerId, Long targetId) {
        FollowId followId = new FollowId(followerId, targetId);

        Follow follow = followRepository.findById(followId)
                .orElseThrow(() -> new IllegalArgumentException("팔로우 관계가 존재하지 않습니다."));

        followRepository.delete(follow);
    }

    public List<FollowResponseDTO.FollowUserDto> getFollowingList(Long userId) {
        return followRepository.findByFollower_UserId(userId).stream()
                .map(follow -> FollowResponseDTO.FollowUserDto.builder()
                        .userId(follow.getTarget().getUserId())
                        .name(follow.getTarget().getName())
                        .nickname(follow.getTarget().getNickname())
                        .build())
                .collect(Collectors.toList());
    }

    public List<FollowResponseDTO.FollowUserDto> getFollowersList(Long userId) {
        return followRepository.findByTarget_UserId(userId).stream()
                .map(follow -> FollowResponseDTO.FollowUserDto.builder()
                        .userId(follow.getFollower().getUserId())
                        .name(follow.getFollower().getName())
                        .nickname(follow.getFollower().getNickname())
                        .build())
                .collect(Collectors.toList());
    }
}
