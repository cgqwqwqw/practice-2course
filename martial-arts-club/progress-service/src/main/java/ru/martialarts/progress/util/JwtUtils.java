package ru.martialarts.progress.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

public final class JwtUtils {

    private JwtUtils() {
    }

    /** Возвращает отображаемое имя пользователя из JWT (claim "name" или email). */
    public static String fullName(Authentication auth) {
        if (auth.getPrincipal() instanceof Jwt jwt) {
            Object name = jwt.getClaim("name");
            if (name != null && !name.toString().isBlank()) {
                return name.toString();
            }
            Object email = jwt.getClaim("email");
            if (email != null && !email.toString().isBlank()) {
                return email.toString();
            }
        }
        return auth.getName();
    }
}
