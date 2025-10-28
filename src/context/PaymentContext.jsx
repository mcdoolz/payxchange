import { createContext, useContext, useState, useEffect } from 'react';

const PaymentContext = createContext();

export const usePayments = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayments must be used within PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('payxchange_payments');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [baseCurrency, setBaseCurrency] = useState(() => {
    return localStorage.getItem('payxchange_baseCurrency') || 'USD';
  });
  
  const [targetCurrency, setTargetCurrency] = useState(() => {
    return localStorage.getItem('payxchange_targetCurrency') || 'EUR';
  });
  
  const [apiLogs, setApiLogs] = useState(() => {
    const saved = localStorage.getItem('payxchange_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [paymentLogs, setPaymentLogs] = useState(() => {
    const saved = localStorage.getItem('payxchange_paymentLogs');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('payxchange_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('payxchange_baseCurrency', baseCurrency);
  }, [baseCurrency]);

  useEffect(() => {
    localStorage.setItem('payxchange_targetCurrency', targetCurrency);
  }, [targetCurrency]);

  useEffect(() => {
    localStorage.setItem('payxchange_logs', JSON.stringify(apiLogs));
  }, [apiLogs]);

  useEffect(() => {
    localStorage.setItem('payxchange_paymentLogs', JSON.stringify(paymentLogs));
  }, [paymentLogs]);

  const addLog = (log) => {
    const timestamp = new Date().toLocaleTimeString();
    const fullLog = { ...log, timestamp };
    
    // Add to general logs
    setApiLogs(prev => [fullLog, ...prev].slice(0, 100));
    
    // Add to payment-specific logs if paymentId is provided
    if (log.paymentId) {
      setPaymentLogs(prev => ({
        ...prev,
        [log.paymentId]: [...(prev[log.paymentId] || []), fullLog]
      }));
    }
  };

  const clearLogs = () => {
    setApiLogs([]);
    setPaymentLogs({});
  };

  const addPayment = (payment) => {
    setPayments(prev => [...prev, { ...payment, id: Date.now() }]);
    addLog({
      type: 'calculation',
      success: true,
      message: `Payment added: ${payment.amount} ${payment.baseCurrency}`,
      details: `${payment.frequency} from ${new Date(payment.startDate).toLocaleDateString()} to ${new Date(payment.endDate).toLocaleDateString()}`
    });
  };

  const removePayment = (id) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    addLog({
      type: 'calculation',
      success: true,
      message: 'Payment entry removed'
    });
  };

  const updatePayment = (id, updatedPayment) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updatedPayment } : p));
  };

  const value = {
    payments,
    baseCurrency,
    targetCurrency,
    apiLogs,
    paymentLogs,
    setBaseCurrency,
    setTargetCurrency,
    addPayment,
    removePayment,
    updatePayment,
    addLog,
    clearLogs,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
