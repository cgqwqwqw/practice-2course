package ru.martialarts.subscription.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.martialarts.subscription.dto.PurchaseRequest;
import ru.martialarts.subscription.model.Subscription;
import ru.martialarts.subscription.service.PurchaseService;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Абонементы", description = "Покупка и история абонементов")
public class SubscriptionController {

    private final PurchaseService purchaseService;

    @Operation(summary = "Купить абонемент (оплата картой эмулируется, можно промокод)")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Subscription purchase(Authentication auth, @Valid @RequestBody PurchaseRequest request) {
        return purchaseService.purchase(auth, request);
    }

    @Operation(summary = "Мои абонементы")
    @GetMapping("/my")
    public List<Subscription> my(Authentication auth) {
        return purchaseService.mySubscriptions(auth);
    }
}
