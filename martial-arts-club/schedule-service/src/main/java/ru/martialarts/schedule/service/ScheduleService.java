package ru.martialarts.schedule.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.martialarts.schedule.dto.CreateSessionRequest;
import ru.martialarts.schedule.model.TrainingSession;
import ru.martialarts.schedule.repository.TrainingSessionRepository;
import ru.martialarts.schedule.util.JwtUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final TrainingSessionRepository sessionRepository;

    public TrainingSession create(Authentication auth, CreateSessionRequest request) {
        TrainingSession session = new TrainingSession();
        session.setStyle(request.style());
        session.setHall(request.hall());
        session.setStartTime(request.startTime());
        session.setEndTime(request.endTime());
        session.setCapacity(request.capacity());
        session.setType(request.type());
        session.setCoachId(UUID.fromString(auth.getName()));
        session.setCoachName(JwtUtils.fullName(auth));
        return sessionRepository.save(session);
    }

    public List<TrainingSession> list(String style, LocalDate date) {
        return sessionRepository.findAll().stream()
                .filter(s -> style == null || s.getStyle().equalsIgnoreCase(style))
                .filter(s -> date == null || s.getStartTime().toLocalDate().equals(date))
                .collect(Collectors.toList());
    }

    public TrainingSession getById(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Тренировка не найдена"));
    }

    public TrainingSession update(Long id, CreateSessionRequest request) {
        TrainingSession session = getById(id);
        session.setStyle(request.style());
        session.setHall(request.hall());
        session.setStartTime(request.startTime());
        session.setEndTime(request.endTime());
        session.setCapacity(request.capacity());
        session.setType(request.type());
        return sessionRepository.save(session);
    }

    /** Отмена тренировки (мягкое удаление). */
    public TrainingSession cancel(Long id) {
        TrainingSession session = getById(id);
        session.setCancelled(true);
        return sessionRepository.save(session);
    }
}
