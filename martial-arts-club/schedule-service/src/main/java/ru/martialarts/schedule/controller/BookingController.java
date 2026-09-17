package ru.martialarts.schedule.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.martialarts.schedule.dto.AttendanceRequest;
import ru.martialarts.schedule.dto.CreateBookingRequest;
import ru.martialarts.schedule.model.Booking;
import ru.martialarts.schedule.service.BookingService;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Запись и посещаемость", description = "Запись учеников на тренировки, отметки о посещении")
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "Записаться на тренировку (ученик)")
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public Booking create(Authentication auth, @Valid @RequestBody CreateBookingRequest request) {
        return bookingService.create(auth, request);
    }

    @Operation(summary = "Отменить запись (свою — ученик, любую — тренер/админ)")
    @PostMapping("/{id}/cancel")
    public Booking cancel(@PathVariable Long id, Authentication auth) {
        return bookingService.cancel(id, auth);
    }

    @Operation(summary = "Мои активные записи")
    @GetMapping("/my")
    public List<Booking> my(Authentication auth) {
        return bookingService.myBookings(auth);
    }

    @Operation(summary = "Записи на тренировку (тренер/админ)")
    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAnyRole('COACH', 'ADMIN')")
    public List<Booking> bySession(@PathVariable Long sessionId) {
        return bookingService.bySession(sessionId);
    }

    @Operation(summary = "Отметить посещение (тренер/админ)")
    @PostMapping("/{id}/attendance")
    @PreAuthorize("hasAnyRole('COACH', 'ADMIN')")
    public Booking attendance(@PathVariable Long id, @RequestBody AttendanceRequest request) {
        return bookingService.markAttendance(id, request.attended());
    }
}
