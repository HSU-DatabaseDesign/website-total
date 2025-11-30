package com.example.WebNovelReviewSite.domain.badge.validation;

import com.example.WebNovelReviewSite.domain.badge.dto.BadgeRequestDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class BadgeCreateValidator implements ConstraintValidator<ValidBadgeCreate, BadgeRequestDTO.BadgeCreateDto> {

    @Override
    public void initialize(ValidBadgeCreate constraintAnnotation) {
    }

    @Override
    public boolean isValid(BadgeRequestDTO.BadgeCreateDto dto, ConstraintValidatorContext context) {
        if (dto == null) {
            return true; // null 체크는 @NotNull이 처리
        }

        boolean hasConditionValue = dto.getConditionValue() != null;
        boolean hasStartDate = dto.getStartDate() != null;
        boolean hasEndDate = dto.getEndDate() != null;

        // startDate와 endDate는 묶음 (둘 다 있거나 둘 다 없어야 함)
        if (hasStartDate != hasEndDate) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("startDate와 endDate는 둘 다 입력하거나 둘 다 비워야 합니다.")
                    .addConstraintViolation();
            return false;
        }

        // conditionValue 또는 (startDate && endDate) 중 하나는 필수
        if (!hasConditionValue && !(hasStartDate && hasEndDate)) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("conditionValue 또는 (startDate와 endDate) 중 하나는 필수입니다.")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}

