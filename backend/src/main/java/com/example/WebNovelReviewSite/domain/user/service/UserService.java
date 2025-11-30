package com.example.WebNovelReviewSite.domain.user.service;

import com.example.WebNovelReviewSite.domain.user.dto.UserRequestDTO;
import com.example.WebNovelReviewSite.domain.user.dto.UserResponseDTO;
import com.example.WebNovelReviewSite.domain.user.entity.User;
import com.example.WebNovelReviewSite.domain.user.enums.Role;
import com.example.WebNovelReviewSite.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public Long signup(UserRequestDTO.UserSignupDto request) {
        // Check duplicates
        if (userRepository.existsByLoginId(request.getId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .name(request.getName())
                .id(request.getId())
                .passwd(request.getPasswd())
                .nickname(request.getNickname())
                .email(request.getEmail())
                .role(Role.USER)
                .followings(new HashSet<>())
                .followers(new HashSet<>())
                .collections(new ArrayList<>())
                .reviews(new ArrayList<>())
                .likeList(new ArrayList<>())
                .build();

        User savedUser = userRepository.save(user);
        return savedUser.getUserId();
    }

    public Long login(UserRequestDTO.UserLoginDto request) {
        User user = userRepository.findByLoginId(request.getId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (!user.getPasswd().equals(request.getPasswd())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return user.getUserId();
    }

    @Transactional
    public void updateUser(Long userId, UserRequestDTO.UserUpdateDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (request.getName() != null)
            user.setName(request.getName());
        if (request.getEmail() != null)
            user.setEmail(request.getEmail());
        if (request.getPasswd() != null)
            user.setPasswd(request.getPasswd());
        if (request.getNickname() != null)
            user.setNickname(request.getNickname());
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        userRepository.delete(user);
    }

    public UserResponseDTO.UserDetailDto getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        return UserResponseDTO.UserDetailDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
