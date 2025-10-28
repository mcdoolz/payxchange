import { useEffect, useState } from 'react';
import { Box, HStack, IconButton, Spinner, Table, Text } from '@chakra-ui/react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { usePayments } from '../context/PaymentContext';
import { fetchExchangeRate } from '../services/exchangeRate';

export const PaymentList = ({ onEdit }) => {
  const { payments, removePayment, targetCurrency, addLog } = usePayments();
  const [conversions, setConversions] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    const calculateConversions = async () => {
      for (const payment of payments) {
        // Validate payment has all required fields
        if (!payment.startDate || !payment.endDate || !payment.amount || !payment.baseCurrency) {
          console.log('Skipping invalid payment:', payment);
          continue;
        }

        // Skip if already processed OR currently loading
        if (conversions[payment.id] !== undefined || loading[payment.id]) continue;

        setLoading(prev => ({ ...prev, [payment.id]: true }));

        const paymentDates = getPaymentDates(payment);
        
        // Skip if no valid dates generated
        if (paymentDates.length === 0) {
          console.log('No valid payment dates for:', payment);
          setLoading(prev => ({ ...prev, [payment.id]: false }));
          continue;
        }

        const totalCalculations = paymentDates.length;
        
        // Debug: Log the actual dates being generated
        console.log('Generated dates:', paymentDates.map(d => format(d, 'yyyy-MM-dd')));
        
        // Parse dates properly for display
        const [startYear, startMonth, startDay] = payment.startDate.split('-').map(Number);
        const [endYear, endMonth, endDay] = payment.endDate.split('-').map(Number);
        const startDateObj = new Date(startYear, startMonth - 1, startDay);
        const endDateObj = new Date(endYear, endMonth - 1, endDay);
        
        addLog({
          type: 'calculation',
          success: true,
          message: `Calculating ${totalCalculations} ${payment.frequency.toLowerCase()} payments`,
          details: `${format(startDateObj, 'MMM yyyy')} to ${format(endDateObj, 'MMM yyyy')}`,
          paymentId: payment.id
        });

        let totalConverted = 0;
        let successCount = 0;

        // Convert each payment individually at its respective date
        for (let i = 0; i < paymentDates.length; i++) {
          const date = paymentDates[i];
          const rate = await fetchExchangeRate(date, payment.baseCurrency, targetCurrency);
          
          if (rate) {
            const converted = payment.amount * rate;
            totalConverted += converted;
            successCount++;
            
            // Log progress for each calculation
            addLog({
              type: 'api',
              success: true,
              message: `Payment ${i + 1}/${totalCalculations}: ${format(date, 'MMM yyyy')} - ${payment.amount} ${payment.baseCurrency} @ ${rate.toFixed(4)}`,
              result: `${converted.toFixed(2)} ${targetCurrency}`,
              progress: i + 1,
              total: totalCalculations,
              paymentId: payment.id
            });
          } else {
            addLog({
              type: 'api',
              success: false,
              message: `Failed to fetch rate for ${format(date, 'MMM dd, yyyy')}`,
              details: `${payment.baseCurrency} → ${targetCurrency}`,
              progress: i + 1,
              total: totalCalculations,
              paymentId: payment.id
            });
          }
        }

        if (successCount > 0) {
          addLog({
            type: 'calculation',
            success: true,
            message: `Total conversion complete`,
            result: `${successCount}/${totalCalculations} payments = ${totalConverted.toFixed(2)} ${targetCurrency}`,
            progress: totalCalculations,
            total: totalCalculations,
            paymentId: payment.id
          });
        }

        setConversions(prev => ({ ...prev, [payment.id]: totalConverted || null }));
        setLoading(prev => ({ ...prev, [payment.id]: false }));
      }
    };

    calculateConversions();
  }, [payments, targetCurrency]);

  const getPaymentDates = (payment) => {
    try {
      // Parse as YYYY-MM-DD in local timezone by splitting and using Date constructor
      const [startYear, startMonth, startDay] = payment.startDate.split('-').map(Number);
      const [endYear, endMonth, endDay] = payment.endDate.split('-').map(Number);
      
      const start = new Date(startYear, startMonth - 1, startDay);
      const end = new Date(endYear, endMonth - 1, endDay);
      
      // Validate dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error('Invalid dates:', payment.startDate, payment.endDate);
        return [];
      }
      
      if (start > end) {
        console.error('Start date is after end date');
        return [];
      }
      
      const dates = [];
      let currentDate = new Date(start);
      const maxIterations = 10000; // Safety limit
      let iterations = 0;

      while (currentDate <= end && iterations < maxIterations) {
        dates.push(new Date(currentDate));
        iterations++;
        
        switch (payment.frequency) {
          case 'Daily':
            currentDate = addDays(currentDate, 1);
            break;
          case 'Weekly':
            currentDate = addWeeks(currentDate, 1);
            break;
          case 'Bi-Weekly':
            currentDate = addWeeks(currentDate, 2);
            break;
          case 'Monthly':
            currentDate = addMonths(currentDate, 1);
            break;
          case 'Quarterly':
            currentDate = addMonths(currentDate, 3);
            break;
          case 'Annually':
            currentDate = addMonths(currentDate, 12);
            break;
          default:
            currentDate = addMonths(currentDate, 1);
        }
      }

      return dates;
    } catch (error) {
      console.error('Error generating payment dates:', error);
      return [];
    }
  };

  const calculateTotalPayments = (payment) => {
    const dates = getPaymentDates(payment);
    return payment.amount * dates.length;
  };

  if (payments.length === 0) {
    return (
      <Box textAlign="center" py={10} bg="white" borderRadius="lg" shadow="md">
        <Text color="gray.600">No payment entries yet. Add one above to get started.</Text>
      </Box>
    );
  }

  const handleEdit = (payment) => {
    if (onEdit) {
      onEdit({
        startDate: payment.startDate,
        endDate: payment.endDate,
        amount: payment.amount,
        frequency: payment.frequency,
      });
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box overflowX="auto" bg="white" borderRadius="lg" shadow="md" p={4}>
      <Table.Root variant="simple">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader py={4} px={4}>Date Range</Table.ColumnHeader>
            <Table.ColumnHeader py={4} px={4}>Amount</Table.ColumnHeader>
            <Table.ColumnHeader py={4} px={4}>Frequency</Table.ColumnHeader>
            <Table.ColumnHeader py={4} px={4}>Total Paid</Table.ColumnHeader>
            <Table.ColumnHeader py={4} px={4}>Converted</Table.ColumnHeader>
            <Table.ColumnHeader py={4} px={4}>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {payments.map(payment => {
            const total = calculateTotalPayments(payment);
            const converted = conversions[payment.id];
            const isLoading = loading[payment.id];

            return (
              <Table.Row key={payment.id}>
                <Table.Cell py={4} px={4}>
                  <Text fontSize="sm" color="black">
                    {typeof payment.startDate === 'string' && !payment.startDate.includes('T') 
                      ? payment.startDate 
                      : format(new Date(payment.startDate), 'yyyy-MM-dd')} - {typeof payment.endDate === 'string' && !payment.endDate.includes('T')
                      ? payment.endDate
                      : format(new Date(payment.endDate), 'yyyy-MM-dd')}
                  </Text>
                </Table.Cell>
                <Table.Cell py={4} px={4}>
                  <Text fontWeight="medium" color="black">
                    {payment.baseCurrency} {payment.amount.toFixed(2)}
                  </Text>
                </Table.Cell>
                <Table.Cell py={4} px={4}>
                  <Text color="black">{payment.frequency}</Text>
                </Table.Cell>
                <Table.Cell py={4} px={4}>
                  <Text fontWeight="semibold" color="black">
                    {payment.baseCurrency} {total.toFixed(2)}
                  </Text>
                </Table.Cell>
                <Table.Cell py={4} px={4}>
                  {isLoading ? (
                    <Spinner size="sm" />
                  ) : converted ? (
                    <Text fontWeight="bold" color="black">
                      {targetCurrency} {converted.toFixed(2)}
                    </Text>
                  ) : (
                    <Text fontSize="sm" color="red.500">Error</Text>
                  )}
                </Table.Cell>
                <Table.Cell py={4} px={4}>
                  <HStack gap={2}>
                    <IconButton
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => handleEdit(payment)}
                      aria-label="Edit payment"
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removePayment(payment.id)}
                      aria-label="Delete payment"
                    >
                      <FaTrash />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
