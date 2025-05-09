package com.example.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

public class CorsConfigManager {
    private static volatile CorsConfigManager instance;

    private CorsConfigManager() {
        // Ngăn chặn instantiation trực tiếp
    }

    public static CorsConfigManager getInstance() {
        if (instance == null) {
            synchronized (CorsConfigManager.class) {
                if (instance == null) {
                    instance = new CorsConfigManager();
                }
            }
        }
        return instance;
    }

    public CorsConfigurationSource getCorsConfigSource() {
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(Arrays.asList(
                        "http://localhost:5173/",
                        "https://warehouse-management-79sj.vercel.app/"));
                cfg.setAllowedMethods(Collections.singletonList("*"));
                cfg.setAllowCredentials(true);
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                cfg.setExposedHeaders(Arrays.asList("Authorization"));
                cfg.setMaxAge(3600L);
                return cfg;
            }
        };
    }
}