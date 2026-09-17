package ru.martialarts.schedule.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.martialarts.schedule.dto.CreateSessionRequest;
import ru.martialarts.schedule.model.TrainingSession;
import ru.martialarts.schedule.service.ScheduleService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
@Tag(name = "Расписание", description = "Управление тренировками (создание — тренер/админ)")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Operation(summary = "Актуальное расписание (фильтр по стилю и дате)")
    @GetMapping
    public List<TrainingSession> list(
            @RequestParam(required = false) String style,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return scheduleService.list(style, date);
    }

    @Operation(summary = "Тренировка по id")
    @GetMapping("/{id}")
    public TrainingSession getById(@PathVariable Long id) {
        return scheduleService.getById(id);
    }

    @Operation(summary = "Создать тренировку (тренер/админ)")
    @PostMapping
    @PreAuthorize("hasAnyRole('COACH', 'ADMIN')")
    public TrainingSession create(Authentication auth, @Valid @RequestBody CreateSessionRequest request) {
        return scheduleService.create(auth, request);
    }

    @Operation(summary = "Изменить тренировку (тренер/админ)")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COACH', 'ADMIN')")
    public TrainingSession update(@PathVariable Long id, @Valid @RequestBody CreateSessionRequest request) {
        return scheduleService.update(id, request);
    }

    @Operation(summary = "Отменить тренировку (тренер/админ)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COACH', 'ADMIN')")
    public TrainingSession cancel(@PathVariable Long id) {
        return scheduleService.cancel(id);
    }
}
