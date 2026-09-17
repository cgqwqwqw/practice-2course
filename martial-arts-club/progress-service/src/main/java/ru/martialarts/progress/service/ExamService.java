package ru.martialarts.progress.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.martialarts.progress.dto.CreateExamRequest;
import ru.martialarts.progress.dto.ExamResultRequest;
import ru.martialarts.progress.model.Exam;
import ru.martialarts.progress.model.ExamStatus;
import ru.martialarts.progress.repository.ExamRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    /** Тренер подаёт заявку на аттестацию ученика. */
    public Exam create(CreateExamRequest request) {
        Exam exam = new Exam();
        exam.setUserId(request.userId());
        exam.setUserName(request.userName());
        exam.setBeltFrom(request.beltFrom());
        exam.setBeltTo(request.beltTo());
        exam.setStatus(ExamStatus.PENDING);
        return examRepository.save(exam);
    }

    /** Тренер выставляет результат; при сдаче пояс обновляется в profile-service через Kafka. */
    public Exam applyResult(Long id, ExamResultRequest request) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Экзамен не найден"));
        if (exam.getStatus() != ExamStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Результат уже выставлен");
        }
        exam.setStatus(request.status());
        exam.setGrade(request.grade());
        exam.setNotes(request.notes());
        Exam saved = examRepository.save(exam);

        if (saved.getStatus() == ExamStatus.PASSED) {
            try {
                String event = objectMapper.writeValueAsString(Map.of(
                        "userId", saved.getUserId().toString(),
                        "belt", saved.getBeltTo()));
                kafkaTemplate.send("belts", saved.getUserId().toString(), event);
            } catch (Exception ignored) {
            }
        }
        return saved;
    }

    public List<Exam> myExams(UUID userId) {
        return examRepository.findByUserIdOrderByExamDateDesc(userId);
    }

    public List<Exam> byUser(UUID userId) {
        return examRepository.findByUserId(userId);
    }
}
