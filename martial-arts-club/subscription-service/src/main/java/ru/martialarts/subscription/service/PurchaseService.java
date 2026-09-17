package ru.martialarts.subscription.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ru.martialarts.subscription.dto.PurchaseRequest;
import ru.martialarts.subscription.model.Payment;
import ru.martialarts.subscription.model.PaymentStatus;
import ru.martialarts.subscription.model.Plan;
import ru.martialarts.subscription.model.PromoCode;
import ru.martialarts.subscription.model.Subscription;
import ru.martialarts.subscription.model.SubscriptionStatus;
import ru.martialarts.subscription.repository.PaymentRepository;
import ru.martialarts.subscription.repository.PlanRepository;
import ru.martialarts.subscription.repository.PromoCodeRepository;
import ru.martialarts.subscription.repository.SubscriptionRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final SubscriptionRepository subscriptionRepository;
    private final PlanRepository planRepository;
    private final PromoCodeRepository promoCodeRepository;
    private final PaymentRepository paymentRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    /** Покупка абонемента: промокод -> эмуляция оплаты карты -> подписка -> событие в Kafka. */
    @Transactional
    public Subscription purchase(Authentication auth, PurchaseRequest request) {
        Plan plan = planRepository.findById(request.planId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Тариф не найден"));

        BigDecimal price = plan.getPrice();
        String promoApplied = null;
        if (request.promoCode() != null && !request.promoCode().isBlank()) {
            PromoCode promo = promoCodeRepository.findById(request.promoCode().toUpperCase())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Промокод не найден"));
            if (!promo.isActive()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Промокод неактивен");
            }
            price = price.multiply(BigDecimal.valueOf(100 - promo.getDiscountPercent()))
                    .divide(BigDecimal.valueOf(100));
            promoApplied = promo.getCode();
        }

        Subscription subscription = new Subscription();
        subscription.setUserId(UUID.fromString(auth.getName()));
        subscription.setPlan(plan);
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusDays(plan.getDurationDays()));
        subscription.setPrice(price);
        subscription.setPromoCode(promoApplied);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        Subscription saved = subscriptionRepository.save(subscription);

        // Эмуляция платежа: карта всегда "проходит"
        Payment payment = new Payment();
        payment.setSubscriptionId(saved.getId());
        payment.setCardLast4(request.cardNumber().substring(request.cardNumber().length() - 4));
        payment.setAmount(price);
        payment.setStatus(PaymentStatus.PAID);
        paymentRepository.save(payment);

        try {
            String event = objectMapper.writeValueAsString(Map.of(
                    "userId", saved.getUserId().toString(),
                    "planId", plan.getId().toString(),
                    "planName", plan.getName(),
                    "amount", price.toString()));
            kafkaTemplate.send("subscriptions", saved.getUserId().toString(), event);
        } catch (Exception ignored) {
        }
        return saved;
    }

    public List<Subscription> mySubscriptions(Authentication auth) {
        return subscriptionRepository.findByUserIdOrderByStartDateDesc(UUID.fromString(auth.getName()));
    }
}
