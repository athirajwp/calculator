package com.calculator.model;

public class CalculationResponse {
    private Double result;

    public CalculationResponse() {}

    public CalculationResponse(Double result) {
        this.result = result;
    }

    public Double getResult() {
        return result;
    }

    public void setResult(Double result) {
        this.result = result;
    }
}
