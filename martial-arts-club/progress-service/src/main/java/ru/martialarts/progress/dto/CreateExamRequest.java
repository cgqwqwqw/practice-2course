package ru.martialarts.progress.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

@Schema(description = "Заявка на аттестацию (подаёт тренер)")
public record CreateExamRequest(
        @Schema(example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
        @NotNull(message = "userId обязателен")
        UUID userId,

        @Schema(example = "Сергей Сидоров")
        @NotBlank(message = "userName обязателен")
        String userName,

        @Schema(example = "9 кю")
        @NotBlank(message = "beltFrom обязателен")
        String beltFrom,

        @Schema(example = "8 кю")
        @NotBlank(message = "beltTo обязателен")
        String beltTo) {
}
