package ru.martialarts.subscription.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.martialarts.subscription.service.AnalyticsService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Администрирование", description = "Финансовая аналитика (только ADMIN)")
public class AdminController {

    private final AnalyticsService analyticsService;

    @Operation(summary = "Аналитика продаж абонементов")
    @GetMapping("/analytics/sales")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> sales() {
        return analyticsService.salesAnalytics();
    }
}
