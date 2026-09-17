package ru.martialarts.subscription.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.martialarts.subscription.dto.PlanRequest;
import ru.martialarts.subscription.model.Plan;
import ru.martialarts.subscription.service.PlanService;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@Tag(name = "Тарифные планы", description = "Каталог абонементов")
public class PlanController {

    private final PlanService planService;

    @Operation(summary = "Доступные тарифы")
    @GetMapping
    public List<Plan> list() {
        return planService.list();
    }

    @Operation(summary = "Создать тариф (админ)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Plan create(@Valid @RequestBody PlanRequest request) {
        return planService.create(request);
    }
}
