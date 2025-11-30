package com.example.WebNovelReviewSite.global.apiPayload.exception;

import com.example.WebNovelReviewSite.global.apiPayload.code.BaseErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GeneralException extends RuntimeException{
    private final BaseErrorCode code;
}
