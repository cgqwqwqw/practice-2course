package ru.martialarts.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import ru.martialarts.auth.dto.LoginRequest;
import ru.martialarts.auth.dto.RegisterRequest;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KeycloakService {

    private final RestClient keycloakRestClient;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    @Value("${keycloak.public-client}")
    private String publicClient;

    /** Регистрирует пользователя в Keycloak, назначает роль и публикует событие user-registered в Kafka. */
    public void register(RegisterRequest request) {
        String adminToken = getAdminToken();

        // 1. Создаём пользователя
        Map<String, Object> user = Map.of(
                "username", request.username(),
                "enabled", true,
                "email", request.email() == null ? "" : request.email(),
                "firstName", request.firstName() == null ? "" : request.firstName(),
                "lastName", request.lastName() == null ? "" : request.lastName(),
                "credentials", List.of(Map.of(
                        "type", "password",
                        "value", request.password(),
                        "temporary", false)));
        try {
            keycloakRestClient.post()
                    .uri("/admin/realms/{realm}/users", realm)
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(user)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException.Conflict e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Пользователь уже существует");
        }

        // 2. Находим id созданного пользователя
        JsonNode found = keycloakRestClient.get()
                .uri("/admin/realms/{realm}/users?username={username}&exact=true", realm, request.username())
                .header("Authorization", "Bearer " + adminToken)
                .retrieve()
                .body(JsonNode.class);
        String userId = found.get(0).get("id").asText();

        // 3. Назначаем realm-роль
        JsonNode role = keycloakRestClient.get()
                .uri("/admin/realms/{realm}/roles/{roleName}", realm, request.role())
                .header("Authorization", "Bearer " + adminToken)
                .retrieve()
                .body(JsonNode.class);
        keycloakRestClient.post()
                .uri("/admin/realms/{realm}/users/{userId}/role-mappings/realm", realm, userId)
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(List.of(Map.of("id", role.get("id").asText(), "name", request.role())))
                .retrieve()
                .toBodilessEntity();

        // 4. Публикуем событие в Kafka — profile-service создаст профиль
        String fullName = ((nullToEmpty(request.firstName()) + " " + nullToEmpty(request.lastName())).trim());
        Map<String, Object> event = Map.of(
                "userId", userId,
                "username", request.username(),
                "fullName", fullName.isEmpty() ? request.username() : fullName,
                "role", request.role());
        try {
            kafkaTemplate.send("users", userId, objectMapper.writeValueAsString(event));
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Ошибка сериализации события");
        }
    }

    /** Получает токен по логину/паролю (grant_type=password) у Keycloak. */
    public Map<String, Object> login(LoginRequest request) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "password");
        form.add("client_id", publicClient);
        form.add("username", request.username());
        form.add("password", request.password());
        try {
            return keycloakRestClient.post()
                    .uri("/realms/{realm}/protocol/openid-connect/token", realm)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {
                    });
        } catch (HttpClientErrorException.Unauthorized e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный логин или пароль");
        }
    }

    /** Сервисный токен клиента auth-service (service account с правами manage-users). */
    private String getAdminToken() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");
        form.add("client_id", "auth-service");
        form.add("client_secret", clientSecret);
        Map<String, Object> token = keycloakRestClient.post()
                .uri("/realms/master/protocol/openid-connect/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
        return (String) token.get("access_token");
    }

    private String nullToEmpty(String s) {
        return s == null ? "" : s;
    }
}
