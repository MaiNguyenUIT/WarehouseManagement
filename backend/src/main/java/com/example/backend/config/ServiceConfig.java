package com.example.backend.config;

import com.example.backend.service.ImportShipmentService;
import com.example.backend.Decorator.LoggingAndValidatingImportShipmentServiceDecorator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class ServiceConfig {

    @Bean
    public ImportShipmentService importShipmentServiceImpl() {
        return new com.example.backend.serviceImpl.ImportShipmentService();
    }

    @Bean
    @Primary
    public ImportShipmentService importShipmentService(ImportShipmentService importShipmentServiceImpl) {
        return new LoggingAndValidatingImportShipmentServiceDecorator(importShipmentServiceImpl);
    }
}