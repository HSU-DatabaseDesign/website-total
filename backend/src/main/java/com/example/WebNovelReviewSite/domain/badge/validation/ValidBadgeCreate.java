package com.example.WebNovelReviewSite.domain.badge.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = BadgeCreateValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidBadgeCreate {
    String message() default "conditionValue 또는 (startDate와 endDate) 중 하나는 필수입니다.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

