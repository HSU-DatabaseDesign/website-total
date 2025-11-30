package com.example.WebNovelReviewSite.domain.user.controller;

import com.example.WebNovelReviewSite.domain.user.dto.UserRequestDTO;
import com.example.WebNovelReviewSite.domain.user.dto.UserResponseDTO;
import com.example.WebNovelReviewSite.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "회원 관리", description = "회원 가입, 로그인, 정보 수정 등 회원 관련 API")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "회원 가입", description = "새로운 회원을 등록합니다. 아이디와 이메일 중복 검사를 수행합니다.")
    @PostMapping("/signup")
    public ResponseEntity<Long> signup(@Valid @RequestBody UserRequestDTO.UserSignupDto request) {
        Long userId = userService.signup(request);
        return ResponseEntity.ok(userId);
    }

    @Operation(summary = "로그인", description = "아이디와 비밀번호로 로그인하여 사용자 ID를 반환합니다.")
    @PostMapping("/login")
    public ResponseEntity<Long> login(@Valid @RequestBody UserRequestDTO.UserLoginDto request) {
        Long userId = userService.login(request);
        return ResponseEntity.ok(userId);
    }

    @Operation(summary = "회원 정보 수정", description = "회원의 이름, 이메일, 비밀번호, 닉네임을 수정합니다.")
    @PutMapping("/{userId}")
    public ResponseEntity<Void> updateUser(@PathVariable Long userId,
            @Valid @RequestBody UserRequestDTO.UserUpdateDto request) {
        userService.updateUser(userId, request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "회원 탈퇴", description = "회원을 탈퇴하고 모든 관련 정보를 삭제합니다.")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "회원 정보 조회", description = "회원 ID로 회원 정보를 조회합니다.")
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDTO.UserDetailDto> getUser(@PathVariable Long userId) {
        UserResponseDTO.UserDetailDto user = userService.getUser(userId);
        return ResponseEntity.ok(user);
    }
}
