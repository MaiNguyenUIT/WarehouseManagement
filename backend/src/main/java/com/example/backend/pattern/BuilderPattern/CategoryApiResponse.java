package com.example.backend.pattern.BuilderPattern;

public class CategoryApiResponse extends BaseApiResponse{
    private CategoryApiResponse(int code, String message, Object data) {
        super(code, message, data);
    }

    public static class Builder {
        private int code;
        private String message;
        private Object data;

        public Builder setCode(int code) {
            this.code = code;
            return this;
        }

        public Builder setMessage(String message) {
            this.message = message;
            return this;
        }

        public Builder setData(Object data) {
            this.data = data;
            return this;
        }

        public CategoryApiResponse build() {
            return new CategoryApiResponse(code, message, data);
        }
    }
}
