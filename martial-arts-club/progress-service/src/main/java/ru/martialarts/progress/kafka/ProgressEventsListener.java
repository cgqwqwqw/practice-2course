package ru.martialarts.progress.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import ru.martialarts.progress.service.VisitService;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProgressEventsListener {

    private final VisitService visitService;
    private final ObjectMapper objectMapper;

    /** Событие записи на тренировку из schedule-service — ведём историю посещений. */
    @KafkaListener(topics = "bookings", groupId = "progress-service")
    public void onBookingCreated(String message) throws Exception {
        JsonNode node = objectMapper.readTree(message);
        log.info("Получено событие записи: {}", message);
        visitService.recordVisit(
                UUID.fromString(node.get("userId").asText()),
                Long.valueOf(node.get("sessionId").asText()),
                node.get("style").asText(),
                LocalDateTime.parse(node.get("startTime").asText()),
                node.has("coachName") ? node.get("coachName").asText() : null);
    }
}
