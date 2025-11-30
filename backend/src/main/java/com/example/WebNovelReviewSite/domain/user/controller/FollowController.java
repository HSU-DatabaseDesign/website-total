package com.example.WebNovelReviewSite.domain.user.controller;

import com.example.WebNovelReviewSite.domain.user.dto.FollowResponseDTO;
import com.example.WebNovelReviewSite.domain.user.service.FollowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "팔로우 관리", description = "팔로우 추가, 취소, 목록 조회 관련 API")
@RestController
@RequestMapping("/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @Operation(summary = "팔로우 추가", description = "다른 사용자를 팔로우합니다. 자기 자신은 팔로우할 수 없습니다.")
    @PostMapping
    public ResponseEntity<Void> addFollow(@RequestParam Long followerId, @RequestParam Long targetId) {
        followService.addFollow(followerId, targetId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "팔로우 취소", description = "팔로우를 취소합니다.")
    @DeleteMapping
    public ResponseEntity<Void> removeFollow(@RequestParam Long followerId, @RequestParam Long targetId) {
        followService.removeFollow(followerId, targetId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "팔로잉 목록 조회", description = "내가 팔로우하는 사용자 목록을 조회합니다.")
    @GetMapping("/{userId}/following")
    public ResponseEntity<List<FollowResponseDTO.FollowUserDto>> getFollowingList(@PathVariable Long userId) {
        List<FollowResponseDTO.FollowUserDto> followingList = followService.getFollowingList(userId);
        return ResponseEntity.ok(followingList);
    }

    @Operation(summary = "팔로워 목록 조회", description = "나를 팔로우하는 사용자 목록을 조회합니다.")
    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<FollowResponseDTO.FollowUserDto>> getFollowersList(@PathVariable Long userId) {
        List<FollowResponseDTO.FollowUserDto> followersList = followService.getFollowersList(userId);
        return ResponseEntity.ok(followersList);
    }
}
