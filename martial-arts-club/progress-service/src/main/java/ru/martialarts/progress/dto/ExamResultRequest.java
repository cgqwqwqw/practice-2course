package ru.martialarts.progress.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import ru.martialarts.progress.model.ExamStatus;

@Schema(description = "Результат аттестации (выставляет тренер)")
public record ExamResultRequest(
        @Schema(example = "PASSED", allowableValues = {"PASSED", "FAILED"})
        @NotNull(message = "status обязателен")
        ExamStatus status,

        @Schema(example = "9")
        @Min(1) @Max(10)
        Integer grade,

        @Schema(example = "Техника ударов хорошая, доработать ката")
        String notes) {
}
