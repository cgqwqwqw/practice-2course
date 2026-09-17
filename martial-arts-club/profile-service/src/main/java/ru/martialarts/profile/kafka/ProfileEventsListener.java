package ru.martialarts.profile.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import ru.martialarts.profile.model.ProfileRole;
import ru.martialarts.profile.service.UserProfileService;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProfileEventsListener {

    private final UserProfileService profileService;
    private final ObjectMapper objectMapper;

    /** Событие регистрации из auth-service: создаём профиль. */
    @KafkaListener(topics = "users", groupId = "profile-service")
    public void onUserRegistered(String message) throws Exception {
        JsonNode node = objectMapper.readTree(message);
        log.info("Получено событие регистрации: {}", message);
        profileService.createFromEvent(
                UUID.fromString(node.get("userId").asText()),
                node.get("username").asText(),
                node.get("fullName").asText(),
                ProfileRole.valueOf(node.get("role").asText()));
    }

    /** Событие присвоения пояса из progress-service. */
    @KafkaListener(topics = "belts", groupId = "profile-service")
    public void onBeltAwarded(String message) throws Exception {
        JsonNode node = objectMapper.readTree(message);
        log.info("Получено событие присвоения пояса: {}", message);
        profileService.updateBelt(
                UUID.fromString(node.get("userId").asText()),
                node.get("belt").asText());
    }
}
