package com.calculator.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorServiceTest {

    private final CalculatorService calculatorService = new CalculatorService();

    @Test
    void testAddition() {
        assertEquals(15.0, calculatorService.calculate(10.0, 5.0, "+"));
    }

    @Test
    void testSubtraction() {
        assertEquals(5.0, calculatorService.calculate(10.0, 5.0, "-"));
    }

    @Test
    void testMultiplication() {
        assertEquals(50.0, calculatorService.calculate(10.0, 5.0, "*"));
    }

    @Test
    void testDivision() {
        assertEquals(2.0, calculatorService.calculate(10.0, 5.0, "/"));
    }

    @Test
    void testDivisionByZero() {
        Exception exception = assertThrows(ArithmeticException.class, () -> {
            calculatorService.calculate(10.0, 0.0, "/");
        });
        assertEquals("Cannot divide by zero", exception.getMessage());
    }

    @Test
    void testInvalidOperator() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            calculatorService.calculate(10.0, 5.0, "^");
        });
        assertTrue(exception.getMessage().contains("Invalid operator"));
    }
}
