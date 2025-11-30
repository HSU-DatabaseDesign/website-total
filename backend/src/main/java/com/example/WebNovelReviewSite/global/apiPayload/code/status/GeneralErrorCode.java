package com.example.WebNovelReviewSite.global.apiPayload.code.status;

import com.example.WebNovelReviewSite.global.apiPayload.code.BaseErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GeneralErrorCode implements BaseErrorCode {

    // 인증
    USER_NOT_EXISTED(HttpStatus.NOT_FOUND,"USER_400","존재하지 않는 계정입니다"),
    UNEXPECTED_TOKEN(HttpStatus.NOT_FOUND,"TOKEN_400","존재하지 않는 토큰 입니다"),

    // 검색
    PAGE_OUT_OF_RANGE(HttpStatus.BAD_REQUEST,"SEARCH_4001","요청한 페이지가 전체 페이지 수를 초과합니다."),
    NO_RESULT(HttpStatus.NOT_FOUND,"SEARCH_40002","검색 결과가 없습니다."),

     // 기본 에러
    _BAD_REQUEST(HttpStatus.BAD_REQUEST, "COMMON_400", "잘못된 요청입니다."),
    _UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "COMMON_401", "인증이 필요합니다."),
    _FORBIDDEN(HttpStatus.FORBIDDEN, "COMMON_403", "금지된 요청입니다."),
    _NO_RESULTS_FOUND(HttpStatus.NOT_FOUND, "COMMON_404", "검색 결과가 없습니다."),
    _INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_500", "서버 에러. 관리자에게 문의 바랍니다."),

    MULTIPLE_FIELD_VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "COMMON_001", "입력된 정보에 오류가 있습니다. 필드별 오류 메시지를 참조하세요."),
    NO_MATCHING_ERROR_STATUS(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_002", "서버 에러. 일치하는 errorStatus를 찾을 수 없습니다."),
    REQUEST_BODY_INVALID(HttpStatus.BAD_REQUEST, "COMMON_003", "요청 본문을 읽을 수 없습니다. 빈 문자열 또는 null이 있는지 확인해주세요."),
    INVALID_DATE_FORMAT(HttpStatus.BAD_REQUEST, "COMMON_004", "요청한 날짜/시간 형식이 올바르지 않습니다. 형식을 확인해주세요."),
    DUPLICATE_UNIQUE_KEY(HttpStatus.CONFLICT, "COMMON_005", "이미 처리된 요청입니다."),

    // s3 사진 첨부 에러
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "FILE_001", "파일 업로드에 실패했습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}