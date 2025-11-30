package com.example.WebNovelReviewSite.global.apiPayload.code.status;

import com.example.WebNovelReviewSite.global.apiPayload.code.BaseSuccessCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GeneralSuccessCode implements BaseSuccessCode {
    _OK(HttpStatus.OK, "COMMON200", "성공입니다."),
    _CREATED(HttpStatus.CREATED, "COMMON201", "요청 성공 및 리소스 생성됨"),
    _DELETED(HttpStatus.NO_CONTENT, "COMMON204", "삭제가 완료되었습니다.");


    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

}
