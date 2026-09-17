package ru.martialarts.progress.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.martialarts.progress.model.Visit;

import java.util.List;
import java.util.UUID;

public interface VisitRepository extends JpaRepository<Visit, Long> {

    List<Visit> findByUserIdOrderByVisitDateDesc(UUID userId);
}
