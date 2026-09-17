package ru.martialarts.subscription.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "promo_codes")
@Getter
@Setter
public class PromoCode {

    @Id
    private String code;

    private int discountPercent;

    private boolean active;
}
