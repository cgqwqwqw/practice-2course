package ru.martialarts.subscription.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Покупка абонемента (оплата эмулируется)")
public record PurchaseRequest(
        @Schema(example = "1")
        @NotNull(message = "planId обязателен")
        Long planId,

        @Schema(example = "WELCOME10")
        String promoCode,

        @Schema(example = "4276123456789012", description = "Номер карты, 12-19 цифр")
        @Pattern(regexp = "\\d{12,19}", message = "cardNumber: 12-19 цифр")
        String cardNumber) {
}
