package com.example.WebNovelReviewSite.domain.novel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class CollectionRequestDTO {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CollectionCreateDto {
        @NotNull(message = "사용자 ID는 필수입니다")
        private Long userId;

        @NotBlank(message = "컬렉션 이름은 필수입니다")
        @Size(max = 255, message = "컬렉션 이름은 255자 이하여야 합니다")
        private String collectionName;

        @Size(max = 255, message = "내용은 255자 이하여야 합니다")
        private String content;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CollectionUpdateDto {
        @Size(max = 255, message = "컬렉션 이름은 255자 이하여야 합니다")
        private String collectionName;

        @Size(max = 255, message = "내용은 255자 이하여야 합니다")
        private String content;
    }
}
