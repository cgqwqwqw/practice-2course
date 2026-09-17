package ru.martialarts.schedule.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.martialarts.schedule.model.Booking;
import ru.martialarts.schedule.model.BookingStatus;

import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    long countBySessionIdAndStatus(Long sessionId, BookingStatus status);

    boolean existsBySessionIdAndClientIdAndStatus(Long sessionId, UUID clientId, BookingStatus status);

    List<Booking> findByClientIdAndStatus(UUID clientId, BookingStatus status);

    List<Booking> findBySessionId(Long sessionId);
}
