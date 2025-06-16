package com.example.backend.pattern.BuilderPattern;

public interface IApiResponse {
    int getCode();
    String getMessage();
    Object getData();
}
