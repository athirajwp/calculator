import { useState, useEffect, useCallback } from 'react';

const Calculator = () => {
  const [currentOperand, setCurrentOperand] = useState('0');
  const [previousOperand, setPreviousOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [error, setError] = useState('');
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleDigit = useCallback((digit) => {
    setError('');
    if (waitingForNewValue) {
      setCurrentOperand(digit);
      setWaitingForNewValue(false);
    } else {
      setCurrentOperand(currentOperand === '0' ? digit : currentOperand + digit);
    }
  }, [currentOperand, waitingForNewValue]);

  const handleOperator = useCallback((op) => {
    setError('');
    if (operator && !waitingForNewValue) {
      calculate(op);
    } else {
      setPreviousOperand(currentOperand);
      setOperator(op);
      setWaitingForNewValue(true);
    }
  }, [currentOperand, operator, waitingForNewValue]);

  const calculate = useCallback(async (nextOp = null) => {
    if (!operator || !previousOperand) return;

    try {
      const response = await fetch('http://localhost:8080/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num1: parseFloat(previousOperand),
          num2: parseFloat(currentOperand),
          operator: operator,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Calculation failed');
        // Reset state on error
        setPreviousOperand(null);
        setOperator(null);
        setWaitingForNewValue(true);
      } else {
        const result = String(data.result);
        setCurrentOperand(result);
        setPreviousOperand(result);
        setOperator(nextOp);
        setWaitingForNewValue(true);
      }
    } catch (err) {
      setError('Cannot connect to server');
      console.error(err);
    }
  }, [currentOperand, operator, previousOperand]);

  const handleClear = useCallback(() => {
    setCurrentOperand('0');
    setPreviousOperand(null);
    setOperator(null);
    setError('');
    setWaitingForNewValue(false);
  }, []);

  const handleEquals = useCallback(() => {
    calculate();
    setOperator(null);
    setPreviousOperand(null);
  }, [calculate]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { key } = e;
      if (/[0-9]/.test(key)) {
        handleDigit(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Escape' || key === 'Backspace' || key === 'c' || key === 'C') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEquals, handleClear]);

  return (
    <div className="calculator-card">
      <div className="error-message">{error}</div>
      <div className="display">
        <div className="previous-operand">
          {previousOperand} {operator}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      
      <div className="keypad">
        <button className="btn-clear" onClick={handleClear} style={{ gridColumn: 'span 3' }}>C</button>
        <button className="btn-operator" onClick={() => handleOperator('/')}>/</button>
        
        <button onClick={() => handleDigit('7')}>7</button>
        <button onClick={() => handleDigit('8')}>8</button>
        <button onClick={() => handleDigit('9')}>9</button>
        <button className="btn-operator" onClick={() => handleOperator('*')}>*</button>
        
        <button onClick={() => handleDigit('4')}>4</button>
        <button onClick={() => handleDigit('5')}>5</button>
        <button onClick={() => handleDigit('6')}>6</button>
        <button className="btn-operator" onClick={() => handleOperator('-')}>-</button>
        
        <button onClick={() => handleDigit('1')}>1</button>
        <button onClick={() => handleDigit('2')}>2</button>
        <button onClick={() => handleDigit('3')}>3</button>
        <button className="btn-operator" onClick={() => handleOperator('+')}>+</button>
        
        <button className="btn-zero" onClick={() => handleDigit('0')}>0</button>
        <button onClick={() => handleDigit('.')}>.</button>
        <button className="btn-equals" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
};

export default Calculator;
