package ru.martialarts.progress.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.martialarts.progress.model.Visit;
import ru.martialarts.progress.repository.VisitRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VisitService {

    private final VisitRepository visitRepository;

    public Visit recordVisit(UUID userId, Long sessionId, String style,
                             java.time.LocalDateTime visitDate, String coachName) {
        Visit visit = new Visit();
        visit.setUserId(userId);
        visit.setSessionId(sessionId);
        visit.setStyle(style);
        visit.setVisitDate(visitDate);
        visit.setCoachName(coachName);
        return visitRepository.save(visit);
    }

    public List<Visit> myVisits(UUID userId) {
        return visitRepository.findByUserIdOrderByVisitDateDesc(userId);
    }
}
