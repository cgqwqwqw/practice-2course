package ru.martialarts.schedule.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ru.martialarts.schedule.model.TrainingType;

import java.time.LocalDateTime;

@Schema(description = "Создание тренировки (тренер)")
public record CreateSessionRequest(
        @Schema(example = "Каратэ")
        @NotBlank(message = "style обязателен")
        String style,

        @Schema(example = "Зал №1")
        @NotBlank(message = "hall обязателен")
        String hall,

        @Schema(example = "2026-09-20T18:00:00")
        @NotNull @Future(message = "startTime должен быть в будущем")
        LocalDateTime startTime,

        @Schema(example = "2026-09-20T19:30:00")
        @NotNull @Future(message = "endTime должен быть в будущем")
        LocalDateTime endTime,

        @Schema(example = "12")
        @Min(value = 1, message = "capacity >= 1")
        int capacity,

        @Schema(example = "GROUP")
        @NotNull
        TrainingType type) {
}
