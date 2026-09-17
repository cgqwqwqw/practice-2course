package ru.martialarts.schedule.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.martialarts.schedule.model.TrainingSession;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
}
