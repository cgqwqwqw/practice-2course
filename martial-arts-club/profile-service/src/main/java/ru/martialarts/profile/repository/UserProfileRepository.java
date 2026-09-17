package ru.martialarts.profile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.martialarts.profile.model.ProfileRole;
import ru.martialarts.profile.model.UserProfile;

import java.util.List;
import java.util.UUID;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {

    List<UserProfile> findByRole(ProfileRole role);
}
