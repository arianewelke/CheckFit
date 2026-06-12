package com.arianewelke.checkFit.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessExceptions.class)
    public ResponseEntity<Map<String, String>> handleBusinessException(BusinessExceptions ex) {
        return buildErrorResponse(ex.getMessage(), ex.getCode(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();
        String message = fieldError != null && fieldError.getDefaultMessage() != null
                ? fieldError.getDefaultMessage()
                : "Dados inválidos. Verifique os campos e tente novamente.";

        return buildErrorResponse(message, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        String message = ex.getReason() != null
                ? ex.getReason()
                : "Não foi possível processar a solicitação.";

        return buildErrorResponse(message, null, HttpStatus.valueOf(ex.getStatusCode().value()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return buildErrorResponse(ex.getMessage(), null, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDeniedException(AccessDeniedException ex) {
        return buildErrorResponse(
                "Você não tem permissão para realizar esta ação.",
                "ACCESS_DENIED",
                HttpStatus.FORBIDDEN
        );
    }

    private ResponseEntity<Map<String, String>> buildErrorResponse(String message, String code, HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        error.put("error", message);
        if (code != null) {
            error.put("code", code);
        }
        return new ResponseEntity<>(error, status);
    }
}
