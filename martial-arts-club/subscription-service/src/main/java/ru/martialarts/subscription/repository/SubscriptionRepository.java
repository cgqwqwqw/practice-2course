package ru.martialarts.subscription.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.martialarts.subscription.model.Subscription;

import java.util.List;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByUserIdOrderByStartDateDesc(UUID userId);

    interface PlanSales {
        String getName();

        Long getCount();

        java.math.BigDecimal getRevenue();
    }

    @Query("SELECT s.plan.name AS name, COUNT(s) AS count, SUM(s.price) AS revenue " +
            "FROM Subscription s GROUP BY s.plan.name")
    List<PlanSales> salesByPlan();
}
