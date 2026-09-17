package ru.martialarts.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.martialarts.auth.dto.LoginRequest;
import ru.martialarts.auth.dto.RegisterRequest;
import ru.martialarts.auth.service.KeycloakService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Аутентификация", description = "Регистрация и получение JWT-токенов")
public class AuthController {

    private final KeycloakService keycloakService;

    @Operation(summary = "Зарегистрировать пользователя (роль USER/COACH/ADMIN)")
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        keycloakService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Пользователь зарегистрирован"));
    }

    @Operation(summary = "Получить JWT-токен (access_token использовать как Bearer)")
    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest request) {
        return keycloakService.login(request);
    }
}
