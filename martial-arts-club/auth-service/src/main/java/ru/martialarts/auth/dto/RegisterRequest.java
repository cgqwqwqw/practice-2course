package ru.martialarts.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Запрос на регистрацию пользователя")
public record RegisterRequest(
        @Schema(example = "client2")
        @NotBlank(message = "username обязателен")
        String username,

        @Schema(example = "password123")
        @NotBlank(message = "password обязателен")
        @Size(min = 6, message = "пароль минимум 6 символов")
        String password,

        @Schema(example = "Алексей")
        String firstName,

        @Schema(example = "Иванов")
        String lastName,

        @Schema(example = "client2@mail.ru")
        @Email(message = "некорректный email")
        String email,

        @Schema(example = "USER", allowableValues = {"USER", "COACH", "ADMIN"})
        @NotBlank(message = "role обязательна")
        @Pattern(regexp = "USER|COACH|ADMIN", message = "role: USER, COACH или ADMIN")
        String role) {
}
