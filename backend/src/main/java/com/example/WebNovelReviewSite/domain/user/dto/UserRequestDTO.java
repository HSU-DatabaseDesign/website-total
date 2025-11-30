package com.example.WebNovelReviewSite.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class UserRequestDTO {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSignupDto {
        @NotBlank(message = "이름은 필수입니다")
        @Size(max = 20, message = "이름은 20자 이하여야 합니다")
        private String name;

        @NotBlank(message = "아이디는 필수입니다")
        @Size(max = 20, message = "아이디는 20자 이하여야 합니다")
        private String id;

        @NotBlank(message = "비밀번호는 필수입니다")
        @Size(max = 20, message = "비밀번호는 20자 이하여야 합니다")
        private String passwd;

        @NotBlank(message = "이메일은 필수입니다")
        @Email(message = "올바른 이메일 형식이 아닙니다")
        @Size(max = 254, message = "이메일은 254자 이하여야 합니다")
        private String email;

        @NotBlank(message = "닉네임은 필수입니다")
        @Size(max = 20, message = "닉네임은 20자 이하여야 합니다")
        private String nickname;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserLoginDto {
        @NotBlank(message = "아이디는 필수입니다")
        private String id;

        @NotBlank(message = "비밀번호는 필수입니다")
        private String passwd;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserUpdateDto {
        @Size(max = 20, message = "이름은 20자 이하여야 합니다")
        private String name;

        @Email(message = "올바른 이메일 형식이 아닙니다")
        @Size(max = 254, message = "이메일은 254자 이하여야 합니다")
        private String email;

        @Size(max = 20, message = "비밀번호는 20자 이하여야 합니다")
        private String passwd;

        @Size(max = 20, message = "닉네임은 20자 이하여야 합니다")
        private String nickname;
    }
}
