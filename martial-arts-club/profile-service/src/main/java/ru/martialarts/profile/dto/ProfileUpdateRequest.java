package ru.martialarts.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Частичное обновление профиля (null-поля не изменяются)")
public record ProfileUpdateRequest(
        @Schema(example = "Иван Иванов")
        String fullName,

        @Schema(example = "25")
        Integer age,

        @Schema(example = "Допуск по здоровью до 10.2026")
        String medicalNotes,

        @Schema(example = "Каратэ (только для тренера)")
        String style,

        @Schema(example = "Тренер II категории")
        String qualification,

        @Schema(example = "Чемпион города 2024")
        String achievements) {
}
