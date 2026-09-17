package ru.martialarts.progress.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.martialarts.progress.dto.CreateExamRequest;
import ru.martialarts.progress.dto.CreateReviewRequest;
import ru.martialarts.progress.dto.ExamResultRequest;
import ru.martialarts.progress.model.Exam;
import ru.martialarts.progress.model.Review;
import ru.martialarts.progress.model.Visit;
import ru.martialarts.progress.service.ExamService;
import ru.martialarts.progress.service.ReviewService;
import ru.martialarts.progress.service.VisitService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@Tag(name = "Прогресс", description = "Аттестации, пояса, отзывы, история посещений")
public class ProgressController {

    private final ExamService examService;
    private final ReviewService reviewService;
    private final VisitService visitService;

    // ---------- аттестации ----------

    @Operation(summary = "Мои экзамены и присвоенные пояса")
    @GetMapping("/exams/my")
    public List<Exam> myExams(Authentication auth) {
        return examService.myExams(UUID.fromString(auth.getName()));
    }

    @Operation(summary = "Экзамены ученика (тренер/админ)")
    @GetMapping("/exams/user/{userId}")
    @PreAuthorize("hasAnyRole('COACH', 'ADMIN')")
    public List<Exam> byUser(@PathVariable UUID userId) {
        return examService.byUser(userId);
    }

    @Operation(summary = "Подать заявку на аттестацию ученика (тренер/админ)")
    @PostMapping("/exams")
    @PreAuthorize("hasAnyRole('COACH', 'ADMIN')")
    public Exam createExam(@Valid @RequestBody CreateExamRequest request) {
        return examService.create(request);
    }

    @Operation(summary = "Выставить результат экзамена и присвоить пояс (тренер/админ)")
    @PatchMapping("/exams/{id}/result")
    @PreAuthorize("hasAnyRole('COACH', 'ADMIN')")
    public Exam result(@PathVariable Long id, @Valid @RequestBody ExamResultRequest request) {
        return examService.applyResult(id, request);
    }

    @Operation(summary = "Требования к аттестации на пояс (кю/дан)")
    @GetMapping("/requirements/{belt}")
    public Map<String, Object> requirements(@PathVariable String belt) {
        Map<String, List<String>> requirements = Map.of(
                "10 кю", List.of("Этикет и стойка", "Падения (укеми)", "Прямой удар кулаком (ои-дзуки)"),
                "9 кю", List.of("Базовые блоки", "Передвижения (фудзи-дачи)", "Комбинация из 3 ударов"),
                "8 кю", List.of("Первое ката", "Удары ногами маэ-гери", "Свободная работа в парах"),
                "7 кю", List.of("Второе ката", "Удары в прыжке", "Работа на макиваре"),
                "1 кю", List.of("Все базовые ката", "Свободное кумитэ", "Часть программы на 1 дан"),
                "1 дан", List.of("Собственное ката", "Кумитэ с несколькими противниками", "Теория и история стиля"));
        List<String> result = requirements.getOrDefault(belt,
                List.of("Требования уточняйте у тренера по программе вашего стиля"));
        return Map.of("belt", belt, "requirements", result);
    }

    // ---------- отзывы ----------

    @Operation(summary = "Оставить отзыв и рейтинг тренеру")
    @PostMapping("/reviews")
    public Review createReview(Authentication auth, @Valid @RequestBody CreateReviewRequest request) {
        return reviewService.create(auth, request);
    }

    @Operation(summary = "Отзывы и средний рейтинг тренера")
    @GetMapping("/reviews/coach/{coachId}")
    public Map<String, Object> reviewsByCoach(@PathVariable UUID coachId) {
        return reviewService.byCoach(coachId);
    }

    // ---------- посещения ----------

    @Operation(summary = "Моя история посещений")
    @GetMapping("/visits/my")
    public List<Visit> myVisits(Authentication auth) {
        return visitService.myVisits(UUID.fromString(auth.getName()));
    }
}
