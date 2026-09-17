package ru.martialarts.subscription.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.martialarts.subscription.model.Plan;

public interface PlanRepository extends JpaRepository<Plan, Long> {
}
