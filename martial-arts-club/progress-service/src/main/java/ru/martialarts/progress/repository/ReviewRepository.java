package ru.martialarts.progress.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.martialarts.progress.model.Review;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByCoachIdOrderByCreatedAtDesc(UUID coachId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.coachId = :coachId")
    double averageRating(@Param("coachId") UUID coachId);
}
