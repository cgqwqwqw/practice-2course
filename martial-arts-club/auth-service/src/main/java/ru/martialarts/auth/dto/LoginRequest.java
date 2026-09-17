package ru.martialarts.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Запрос на получение токена")
public record LoginRequest(
        @Schema(example = "client1")
        @NotBlank(message = "username обязателен")
        String username,

        @Schema(example = "client123")
        @NotBlank(message = "password обязателен")
        String password) {
}
