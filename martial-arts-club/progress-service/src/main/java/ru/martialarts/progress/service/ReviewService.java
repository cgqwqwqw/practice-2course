package ru.martialarts.progress.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.martialarts.progress.dto.CreateReviewRequest;
import ru.martialarts.progress.model.Review;
import ru.martialarts.progress.repository.ReviewRepository;
import ru.martialarts.progress.util.JwtUtils;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Review create(Authentication auth, CreateReviewRequest request) {
        Review review = new Review();
        review.setCoachId(request.coachId());
        review.setRating(request.rating());
        review.setComment(request.comment());
        review.setUserId(UUID.fromString(auth.getName()));
        review.setUserName(JwtUtils.fullName(auth));
        return reviewRepository.save(review);
    }

    public Map<String, Object> byCoach(UUID coachId) {
        return Map.of(
                "coachId", coachId,
                "averageRating", reviewRepository.averageRating(coachId),
                "reviews", reviewRepository.findByCoachIdOrderByCreatedAtDesc(coachId));
    }
}
