package ru.martialarts.progress.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

@Schema(description = "Отзыв и рейтинг тренеру (оставляет ученик)")
public record CreateReviewRequest(
        @Schema(example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
        @NotNull(message = "coachId обязателен")
        UUID coachId,

        @Schema(example = "5")
        @NotNull @Min(1) @Max(5)
        Integer rating,

        @Schema(example = "Отличная подача материала, индивидуальный подход")
        String comment) {
}
