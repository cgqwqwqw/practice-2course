package ru.martialarts.schedule.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Запись на тренировку (ученик)")
public record CreateBookingRequest(
        @Schema(example = "1")
        @NotNull(message = "sessionId обязателен")
        Long sessionId) {
}
