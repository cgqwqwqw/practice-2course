package ru.martialarts.progress.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.martialarts.progress.model.Exam;

import java.util.List;
import java.util.UUID;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findByUserIdOrderByExamDateDesc(UUID userId);

    List<Exam> findByUserId(UUID userId);
}
