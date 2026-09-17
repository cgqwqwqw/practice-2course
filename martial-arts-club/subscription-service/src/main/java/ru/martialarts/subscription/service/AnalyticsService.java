package ru.martialarts.subscription.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.martialarts.subscription.model.PaymentStatus;
import ru.martialarts.subscription.model.PromoCode;
import ru.martialarts.subscription.repository.PaymentRepository;
import ru.martialarts.subscription.repository.PromoCodeRepository;
import ru.martialarts.subscription.repository.SubscriptionRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PromoCodeRepository promoCodeRepository;

    /** Финансовая аналитика для администратора. */
    public Map<String, Object> salesAnalytics() {
        BigDecimal totalRevenue = paymentRepository.totalByStatus(PaymentStatus.PAID);
        List<SubscriptionRepository.PlanSales> byPlan = subscriptionRepository.salesByPlan();
        return Map.of(
                "totalRevenue", totalRevenue,
                "paidPayments", paymentRepository.findAll().stream()
                        .filter(p -> p.getStatus() == PaymentStatus.PAID).count(),
                "salesByPlan", byPlan);
    }

    public PromoCode validatePromo(String code) {
        return promoCodeRepository.findById(code.toUpperCase())
                .filter(PromoCode::isActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Промокод не найден или неактивен"));
    }
}
