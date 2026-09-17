package ru.martialarts.progress.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "exams")
@Getter
@Setter
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID userId;

    private String userName;

    private String beltFrom;

    private String beltTo;

    private LocalDateTime examDate = LocalDateTime.now();

    private Integer grade;

    @Enumerated(EnumType.STRING)
    private ExamStatus status = ExamStatus.PENDING;

    private String notes;
}
