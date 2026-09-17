package ru.martialarts.profile.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.martialarts.profile.dto.ProfileUpdateRequest;
import ru.martialarts.profile.model.ProfileRole;
import ru.martialarts.profile.model.UserProfile;
import ru.martialarts.profile.repository.UserProfileRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository repository;

    public UserProfile getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Профиль не найден"));
    }

    public List<UserProfile> getCoaches() {
        return repository.findByRole(ProfileRole.COACH);
    }

    /** Создаёт профиль по событию регистрации из auth-service (идемпотентно). */
    public void createFromEvent(UUID id, String username, String fullName, ProfileRole role) {
        if (repository.existsById(id)) {
            return;
        }
        UserProfile profile = new UserProfile();
        profile.setId(id);
        profile.setUsername(username);
        profile.setFullName(fullName);
        profile.setRole(role);
        repository.save(profile);
    }

    /** Обновляет пояс по событию из progress-service. */
    public void updateBelt(UUID userId, String belt) {
        repository.findById(userId).ifPresent(profile -> {
            profile.setBeltLevel(belt);
            repository.save(profile);
        });
    }

    public UserProfile update(UUID id, ProfileUpdateRequest request) {
        UserProfile profile = getById(id);
        if (request.fullName() != null) {
            profile.setFullName(request.fullName());
        }
        if (request.age() != null) {
            profile.setAge(request.age());
        }
        if (request.medicalNotes() != null) {
            profile.setMedicalNotes(request.medicalNotes());
        }
        if (request.style() != null) {
            profile.setStyle(request.style());
        }
        if (request.qualification() != null) {
            profile.setQualification(request.qualification());
        }
        if (request.achievements() != null) {
            profile.setAchievements(request.achievements());
        }
        return repository.save(profile);
    }
}
