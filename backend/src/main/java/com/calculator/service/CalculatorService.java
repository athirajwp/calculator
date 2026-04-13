package com.calculator.service;

import org.springframework.stereotype.Service;

@Service
public class CalculatorService {

    public Double calculate(Double num1, Double num2, String operator) {
        if (num1 == null || num2 == null || operator == null) {
            throw new IllegalArgumentException("Invalid input: num1, num2, and operator must not be null.");
        }

        return switch (operator) {
            case "+" -> num1 + num2;
            case "-" -> num1 - num2;
            case "*" -> num1 * num2;
            case "/" -> {
                if (num2 == 0) {
                    throw new ArithmeticException("Cannot divide by zero");
                }
                yield num1 / num2;
            }
            default -> throw new IllegalArgumentException("Invalid operator: " + operator);
        };
    }
}
