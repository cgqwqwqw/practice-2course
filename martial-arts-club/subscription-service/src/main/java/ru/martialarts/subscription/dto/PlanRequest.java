package ru.martialarts.subscription.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Schema(description = "Тарифный план (создание — админ)")
public record PlanRequest(
        @Schema(example = "Стандарт")
        @NotBlank(message = "name обязателен")
        String name,

        @Schema(example = "8 занятий в месяц, любые стили")
        String description,

        @Schema(example = "2500.00")
        @NotNull @Min(1)
        BigDecimal price,

        @Schema(example = "30")
        @Min(1)
        int durationDays) {
}
