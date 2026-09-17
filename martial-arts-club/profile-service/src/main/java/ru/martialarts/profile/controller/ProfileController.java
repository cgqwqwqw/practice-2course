package ru.martialarts.profile.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.martialarts.profile.dto.ProfileUpdateRequest;
import ru.martialarts.profile.model.UserProfile;
import ru.martialarts.profile.service.UserProfileService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
@Tag(name = "Профили", description = "Личные данные учеников и тренеров")
public class ProfileController {

    private final UserProfileService profileService;

    @Operation(summary = "Мой профиль")
    @GetMapping("/me")
    public UserProfile me(Authentication auth) {
        return profileService.getById(UUID.fromString(auth.getName()));
    }

    @Operation(summary = "Редактировать мой профиль (ФИО, возраст, мед. допуски и т.д.)")
    @PutMapping("/me")
    public UserProfile updateMe(Authentication auth, @Valid @RequestBody ProfileUpdateRequest request) {
        return profileService.update(UUID.fromString(auth.getName()), request);
    }

    @Operation(summary = "Список тренеров (для выбора и отзывов)")
    @GetMapping("/coaches")
    public List<UserProfile> coaches() {
        return profileService.getCoaches();
    }

    @Operation(summary = "Профиль пользователя по id")
    @GetMapping("/{id}")
    public UserProfile getById(@PathVariable UUID id) {
        return profileService.getById(id);
    }
}
