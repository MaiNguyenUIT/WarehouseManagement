package com.example.backend.pattern.BuilderPattern;

public class ApiResponse<T> {
    private T data;
    private int status;
    private String message;

    private ApiResponse(Builder<T> builder) {
        this.data = builder.data;
        this.status = builder.status;
        this.message = builder.message;
    }

    // Static inner Builder class
    public static class Builder<T> {
        private T data;
        private int status;
        private String message;

        public Builder<T> data(T data) {
            this.data = data;
            return this;
        }

        public Builder<T> status(int status) {
            this.status = status;
            return this;
        }

        public Builder<T> message(String message) {
            this.message = message;
            return this;
        }

        public ApiResponse<T> build() {
            return new ApiResponse<>(this);
        }
    }

    public T getData() {
        return data;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}

