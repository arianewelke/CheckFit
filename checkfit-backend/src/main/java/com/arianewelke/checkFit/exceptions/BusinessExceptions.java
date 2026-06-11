package com.arianewelke.checkFit.exceptions;

public class BusinessExceptions extends RuntimeException {
    private final String code;

    public BusinessExceptions(String message) {
        super(message);
        this.code = null;
    }

    public BusinessExceptions(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
