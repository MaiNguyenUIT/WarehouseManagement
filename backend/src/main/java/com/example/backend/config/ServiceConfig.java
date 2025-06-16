package com.example.backend.config;

import com.example.backend.pattern.Decorator.CachingImportShipmentServiceDecorator;
import com.example.backend.pattern.Decorator.LoggingAndValidatingImportShipmentServiceDecorator;
import com.example.backend.pattern.Decorator.SecurityImportShipmentServiceDecorator;
import com.example.backend.service.ImportShipmentService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class ServiceConfig {

    @Bean("importShipmentServiceImpl")
    public ImportShipmentService importShipmentServiceImpl() {
        return new com.example.backend.serviceImpl.ImportShipmentService();
    }

    @Bean
    @Primary
    public ImportShipmentService importShipmentService(@Qualifier("importShipmentServiceImpl") ImportShipmentService importShipmentServiceImpl) {
        ImportShipmentService serviceWithCaching = new CachingImportShipmentServiceDecorator(importShipmentServiceImpl);
        ImportShipmentService serviceWithLoggingAndValidation = new LoggingAndValidatingImportShipmentServiceDecorator(serviceWithCaching);
        return new SecurityImportShipmentServiceDecorator(serviceWithLoggingAndValidation);
    }
}