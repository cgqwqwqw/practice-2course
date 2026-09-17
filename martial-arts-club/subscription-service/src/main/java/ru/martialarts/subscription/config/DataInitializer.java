package ru.martialarts.subscription.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.martialarts.subscription.model.Plan;
import ru.martialarts.subscription.model.PromoCode;
import ru.martialarts.subscription.repository.PlanRepository;
import ru.martialarts.subscription.repository.PromoCodeRepository;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final PlanRepository planRepository;
    private final PromoCodeRepository promoCodeRepository;

    @Override
    public void run(String... args) {
        if (planRepository.count() == 0) {
            Plan basic = new Plan();
            basic.setName("Базовый");
            basic.setDescription("4 занятия в месяц, один стиль на выбор");
            basic.setPrice(new BigDecimal("1500.00"));
            basic.setDurationDays(30);
            planRepository.save(basic);

            Plan standard = new Plan();
            standard.setName("Стандарт");
            standard.setDescription("8 занятий в месяц, любые групповые стили");
            standard.setPrice(new BigDecimal("2500.00"));
            standard.setDurationDays(30);
            planRepository.save(standard);

            Plan yearly = new Plan();
            yearly.setName("Годовой безлимит");
            yearly.setDescription("Безлимитные групповые и индивидуальные тренировки");
            yearly.setPrice(new BigDecimal("20000.00"));
            yearly.setDurationDays(365);
            planRepository.save(yearly);
        }
        if (promoCodeRepository.count() == 0) {
            PromoCode welcome = new PromoCode();
            welcome.setCode("WELCOME10");
            welcome.setDiscountPercent(10);
            welcome.setActive(true);
            promoCodeRepository.save(welcome);

            PromoCode summer = new PromoCode();
            summer.setCode("SUMMER20");
            summer.setDiscountPercent(20);
            summer.setActive(true);
            promoCodeRepository.save(summer);
        }
    }
}
