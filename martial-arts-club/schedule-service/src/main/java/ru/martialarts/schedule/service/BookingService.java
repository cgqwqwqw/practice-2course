package ru.martialarts.schedule.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.martialarts.schedule.dto.CreateBookingRequest;
import ru.martialarts.schedule.model.Booking;
import ru.martialarts.schedule.model.BookingStatus;
import ru.martialarts.schedule.model.TrainingSession;
import ru.martialarts.schedule.repository.BookingRepository;
import ru.martialarts.schedule.util.JwtUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ScheduleService scheduleService;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    /** Запись ученика на тренировку с проверкой вместимости и дублирования. */
    public Booking create(Authentication auth, CreateBookingRequest request) {
        TrainingSession session = scheduleService.getById(request.sessionId());
        UUID clientId = UUID.fromString(auth.getName());

        if (session.isCancelled()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Тренировка отменена");
        }
        if (session.getStartTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Тренировка уже прошла");
        }
        if (bookingRepository.existsBySessionIdAndClientIdAndStatus(
                session.getId(), clientId, BookingStatus.BOOKED)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Вы уже записаны на эту тренировку");
        }
        long booked = bookingRepository.countBySessionIdAndStatus(session.getId(), BookingStatus.BOOKED);
        if (booked >= session.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Нет свободных мест");
        }

        Booking booking = new Booking();
        booking.setSessionId(session.getId());
        booking.setClientId(clientId);
        booking.setClientName(JwtUtils.fullName(auth));
        booking.setStatus(BookingStatus.BOOKED);
        Booking saved = bookingRepository.save(booking);

        // Событие в Kafka — progress-service ведёт историю посещений
        try {
            String event = objectMapper.writeValueAsString(Map.of(
                    "userId", clientId.toString(),
                    "sessionId", session.getId().toString(),
                    "style", session.getStyle(),
                    "startTime", session.getStartTime().toString(),
                    "coachName", session.getCoachName() == null ? "" : session.getCoachName()));
            kafkaTemplate.send("bookings", clientId.toString(), event);
        } catch (Exception ignored) {
        }
        return saved;
    }

    /** Отмена записи: сам ученик, тренер или администратор. */
    public Booking cancel(Long id, Authentication auth) {
        Booking booking = getById(id);
        UUID caller = UUID.fromString(auth.getName());
        boolean isStaff = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COACH") || a.getAuthority().equals("ROLE_ADMIN"));
        if (!isStaff && !booking.getClientId().equals(caller)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Можно отменять только свои записи");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public Booking markAttendance(Long id, boolean attended) {
        Booking booking = getById(id);
        booking.setAttended(attended);
        return bookingRepository.save(booking);
    }

    public List<Booking> myBookings(Authentication auth) {
        return bookingRepository.findByClientIdAndStatus(
                UUID.fromString(auth.getName()), BookingStatus.BOOKED);
    }

    public List<Booking> bySession(Long sessionId) {
        return bookingRepository.findBySessionId(sessionId);
    }

    private Booking getById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Запись не найдена"));
    }
}
