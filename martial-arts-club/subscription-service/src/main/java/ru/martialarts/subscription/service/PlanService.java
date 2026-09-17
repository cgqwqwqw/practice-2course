package ru.martialarts.subscription.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.martialarts.subscription.dto.PlanRequest;
import ru.martialarts.subscription.model.Plan;
import ru.martialarts.subscription.repository.PlanRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    public List<Plan> list() {
        return planRepository.findAll();
    }

    public Plan create(PlanRequest request) {
        Plan plan = new Plan();
        plan.setName(request.name());
        plan.setDescription(request.description());
        plan.setPrice(request.price());
        plan.setDurationDays(request.durationDays());
        return planRepository.save(plan);
    }
}
