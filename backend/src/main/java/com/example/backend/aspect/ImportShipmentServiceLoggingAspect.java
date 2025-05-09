package com.example.backend.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.aspectj.lang.annotation.Aspect;

@Aspect
@Component
public class ImportShipmentServiceLoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(ImportShipmentServiceLoggingAspect.class);

    @Before("execution(* com.example.backend.serviceImpl.ImportShipmentService.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        logger.info("Executing method: {} with arguments: {}", 
            joinPoint.getSignature().getName(), joinPoint.getArgs());
    }

    @AfterReturning(pointcut = "execution(* com.example.backend.serviceImpl.ImportShipmentService.*(..))", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        logger.info("Method {} returned: {}", joinPoint.getSignature().getName(), result);
    }
}