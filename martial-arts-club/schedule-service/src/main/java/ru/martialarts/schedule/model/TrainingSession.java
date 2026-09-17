package ru.martialarts.schedule.model;

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
@Table(name = "training_sessions")
@Getter
@Setter
public class TrainingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Стиль: каратэ, дзюдо, айкидо и т.д. */
    private String style;

    private UUID coachId;

    private String coachName;

    private String hall;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private int capacity;

    @Enumerated(EnumType.STRING)
    private TrainingType type;

    private boolean cancelled;
}
