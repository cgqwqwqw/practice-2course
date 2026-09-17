package ru.martialarts.profile.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
public class UserProfile {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    private String username;

    private String fullName;

    private Integer age;

    /** Текущий уровень подготовки / пояс, например "10 кю", "1 дан". */
    private String beltLevel = "10 кю";

    /** Медицинские допуски / противопоказания. */
    private String medicalNotes;

    @Enumerated(EnumType.STRING)
    private ProfileRole role;

    // ---- поля тренера ----
    private String style;

    private String qualification;

    private String achievements;
}
