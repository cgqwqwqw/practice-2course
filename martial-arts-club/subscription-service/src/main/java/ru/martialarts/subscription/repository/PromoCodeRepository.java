package ru.martialarts.subscription.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.martialarts.subscription.model.PromoCode;

public interface PromoCodeRepository extends JpaRepository<PromoCode, String> {
}
