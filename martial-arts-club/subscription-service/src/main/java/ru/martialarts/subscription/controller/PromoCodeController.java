package ru.martialarts.subscription.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.martialarts.subscription.model.PromoCode;
import ru.martialarts.subscription.service.AnalyticsService;

@RestController
@RequestMapping("/api/promo-codes")
@RequiredArgsConstructor
@Tag(name = "Промокоды", description = "Проверка промокодов на скидку")
public class PromoCodeController {

    private final AnalyticsService analyticsService;

    @Operation(summary = "Проверить промокод")
    @GetMapping("/{code}")
    public PromoCode validate(@PathVariable String code) {
        return analyticsService.validatePromo(code);
    }
}
