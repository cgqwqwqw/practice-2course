package ru.martialarts.schedule.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Отметка о посещении (тренер)")
public record AttendanceRequest(
        @Schema(example = "true")
        boolean attended) {
}
