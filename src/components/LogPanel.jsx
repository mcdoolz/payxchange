import React from 'react';
import { Box, Heading, Text, VStack, HStack, Badge, Button } from '@chakra-ui/react';
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from '@chakra-ui/react/collapsible';
import { FaCheckCircle, FaTimesCircle, FaCalculator, FaExchangeAlt, FaDownload, FaFileExport, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { usePayments } from '../context/PaymentContext';

export const LogPanel = ({ apiLogs = [] }) => {
  const { payments, paymentLogs, clearLogs, targetCurrency } = usePayments();
  const [expandedPayments, setExpandedPayments] = React.useState({});

  const togglePayment = (paymentId) => {
    setExpandedPayments(prev => ({
      ...prev,
      [paymentId]: !prev[paymentId]
    }));
  };

  // Group logs by payment ID
  const groupedLogs = {};
  payments.forEach(payment => {
    groupedLogs[payment.id] = paymentLogs[payment.id] || [];
  });

  // Export single payment log as CSV
  const exportPaymentLog = (payment) => {
    const logs = paymentLogs[payment.id] || [];
    const csvContent = [
      ['Timestamp', 'Type', 'Status', 'Message', 'Details', 'Result', 'Progress'].join(','),
      ...logs.map(log => [
        log.timestamp,
        log.type,
        log.success ? 'Success' : 'Error',
        `"${log.message}"`,
        `"${log.details || ''}"`,
        `"${log.result || ''}"`,
        log.progress && log.total ? `${log.progress}/${log.total}` : ''
      ].join(','))
    ].join('\n');
    
    downloadCSV(csvContent, `payxchange-payment-${payment.id}-log.csv`);
  };

  // Export all logs as CSV
  const exportAllLogs = () => {
    const csvContent = [
      ['Timestamp', 'Payment ID', 'Type', 'Status', 'Message', 'Details', 'Result', 'Progress'].join(','),
      ...apiLogs.map(log => [
        log.timestamp,
        log.paymentId || 'N/A',
        log.type,
        log.success ? 'Success' : 'Error',
        `"${log.message}"`,
        `"${log.details || ''}"`,
        `"${log.result || ''}"`,
        log.progress && log.total ? `${log.progress}/${log.total}` : ''
      ].join(','))
    ].join('\n');
    
    downloadCSV(csvContent, 'payxchange-all-logs.csv');
  };

  // Export cumulative calculations report
  const exportCumulativeReport = () => {
    const report = payments.map(payment => {
      const logs = paymentLogs[payment.id] || [];
      const calculations = logs.filter(log => log.type === 'api' && log.result);
      const total = logs.find(log => log.message.includes('Total conversion complete'));
      
      return {
        'Start Date': format(new Date(payment.startDate), 'MMM dd, yyyy'),
        'End Date': format(new Date(payment.endDate), 'MMM dd, yyyy'),
        'Frequency': payment.frequency,
        'Amount': `${payment.baseCurrency} ${payment.amount}`,
        'Calculations': calculations.length,
        'Total Converted': total?.result || 'N/A',
        'Details': calculations.map(c => c.message).join('; ')
      };
    });

    let csvContent = [
      Object.keys(report[0] || {}).join(','),
      ...report.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');

    // Add totals section if there are multiple payments
    if (payments.length > 1) {
      // Calculate totals grouped by currency
      const calculateTotalPayments = (payment) => {
        const [year, month, day] = payment.startDate.split('-').map(Number);
        const startDateObj = new Date(year, month - 1, day);
        const [endYear, endMonth, endDay] = payment.endDate.split('-').map(Number);
        const endDateObj = new Date(endYear, endMonth - 1, endDay);

        let count = 0;
        let currentDate = startDateObj;

        while (currentDate <= endDateObj) {
          count++;
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
            case 'Semi-Monthly':
              currentDate = addWeeks(currentDate, 2);
              break;
            case 'Monthly':
              currentDate = addMonths(currentDate, 1);
              break;
            case 'Quarterly':
              currentDate = addMonths(currentDate, 3);
              break;
            default:
              currentDate = addMonths(currentDate, 1);
          }
        }
        return payment.amount * count;
      };

      const totalsByCurrency = payments.reduce((acc, payment) => {
        const currency = payment.baseCurrency;
        const total = calculateTotalPayments(payment);
        
        if (!acc[currency]) {
          acc[currency] = 0;
        }
        acc[currency] += total;
        
        return acc;
      }, {});

      // Calculate grand total converted from payment logs
      const grandTotalConverted = payments.reduce((sum, payment) => {
        const logs = paymentLogs[payment.id] || [];
        const totalLog = logs.find(log => log.message.includes('Total conversion complete'));
        
        if (totalLog && totalLog.result) {
          // Extract number from result string like "12/12 payments = 187134.00 EUR"
          const match = totalLog.result.match(/=\s*([\d.]+)/);
          if (match) {
            return sum + parseFloat(match[1]);
          }
        }
        return sum;
      }, 0);

      // Add blank row and totals section
      csvContent += '\n\n';
      csvContent += '"TOTALS",,,,,,\n';
      
      // Add row for each currency
      Object.entries(totalsByCurrency).forEach(([currency, total]) => {
        csvContent += `"","","","${currency} ${total.toFixed(2)}","","",\n`;
      });
      
      // Add grand total converted
      csvContent += `"","","","","${grandTotalConverted.toFixed(2)} ${targetCurrency}","",`;
    }
    
    downloadCSV(csvContent, 'payxchange-cumulative-report.csv');
  };

  // Helper function to download CSV
  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to interpolate color from orange to green based on progress
  const getProgressColor = (progress, total) => {
    if (!progress || !total) return { bg: "gray.50", border: "gray.400" };
    
    const percentage = progress / total;
    
    // Orange (255, 165, 0) to Green (34, 197, 94)
    const r = Math.round(255 - (255 - 34) * percentage);
    const g = Math.round(165 + (197 - 165) * percentage);
    const b = Math.round(0 + (94 - 0) * percentage);
    
    const bgColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
    const borderColor = `rgb(${r}, ${g}, ${b})`;
    
    return { bg: bgColor, border: borderColor };
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md" h="full" display="flex" flexDirection="column">
      <HStack justify="space-between" mb={4}>
        <Heading size="md" color="black">Activity Log</Heading>
        <HStack gap={2}>
          <Button
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={clearLogs}
            leftIcon={<FaTrash />}
            isDisabled={apiLogs.length === 0}
            px={3}
            py={2}
          >
            Clear
          </Button>
          <Button
            size="sm"
            colorScheme="purple"
            onClick={exportCumulativeReport}
            leftIcon={<FaFileExport />}
            isDisabled={payments.length === 0}
            px={3}
            py={2}
          >
            Export Report
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={exportAllLogs}
            leftIcon={<FaDownload />}
            isDisabled={apiLogs.length === 0}
            px={3}
            py={2}
          >
            Export Log
          </Button>
        </HStack>
      </HStack>
      
      <Box flex="1" overflowY="auto" pr={2} css={{
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}>
        <VStack align="stretch" gap={4}>
          {payments.length === 0 ? (
            <Text color="gray.600" fontSize="sm">No activity yet. Add a payment entry to see logs.</Text>
          ) : (
            <>
              {payments.map((payment, idx) => {
                const logs = paymentLogs[payment.id] || [];
                const hasLogs = logs.length > 0;
                const isExpanded = expandedPayments[payment.id];
                
                return (
                  <CollapsibleRoot key={payment.id} open={isExpanded} onOpenChange={() => togglePayment(payment.id)}>
                    <Box borderWidth="1px" borderColor="gray.200" borderRadius="md" p={3} bg="gray.50">
                      <HStack justify="space-between" mb={2}>
                        <CollapsibleTrigger asChild>
                          <HStack 
                            flex={1} 
                            cursor="pointer"
                            _hover={{ opacity: 0.8 }}
                          >
                            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                            <VStack align="start" gap={0}>
                              <Text fontSize="sm" fontWeight="bold" color="black">
                                Payment Entry #{payments.length - idx}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                {typeof payment.startDate === 'string' && !payment.startDate.includes('T')
                                  ? payment.startDate
                                  : format(new Date(payment.startDate), 'yyyy-MM-dd')} - {typeof payment.endDate === 'string' && !payment.endDate.includes('T')
                                  ? payment.endDate
                                  : format(new Date(payment.endDate), 'yyyy-MM-dd')}
                              </Text>
                            </VStack>
                          </HStack>
                        </CollapsibleTrigger>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => exportPaymentLog(payment)}
                          leftIcon={<FaDownload />}
                          isDisabled={!hasLogs}
                          px={3}
                          py={1}
                        >
                          Export
                        </Button>
                      </HStack>
                      
                      <CollapsibleContent>
                        {hasLogs ? (
                          <VStack align="stretch" gap={2} mt={2}>
                            {logs.map((log, logIdx) => {
                              const colors = log.success 
                                ? getProgressColor(log.progress, log.total)
                                : { bg: "red.50", border: "red.500" };
                              
                              const iconColor = log.success
                                ? (log.progress && log.total && log.progress === log.total ? "green" : `rgb(${Math.round(255 - (255 - 34) * (log.progress / log.total))}, ${Math.round(165 + (197 - 165) * (log.progress / log.total))}, ${Math.round(0 + (94 - 0) * (log.progress / log.total))})`)
                                : "red";

                              return (
                                <Box 
                                  key={logIdx} 
                                  p={2} 
                                  bg={colors.bg}
                                  borderRadius="md" 
                                  borderLeft="3px solid" 
                                  borderColor={colors.border}
                                >
                              <HStack justify="space-between" mb={1}>
                                <HStack gap={1}>
                                  {log.type === 'api' ? (
                                    <FaExchangeAlt size={12} color={iconColor} />
                                  ) : (
                                    <FaCalculator size={12} color={iconColor} />
                                  )}
                                  <Text fontSize="xs" fontWeight="bold" color="gray.700">
                                    {log.timestamp}
                                  </Text>
                                  {log.progress && log.total && (
                                    <Badge size="xs" colorScheme={log.progress === log.total ? "green" : "orange"}>
                                      {log.progress}/{log.total}
                                    </Badge>
                                  )}
                                </HStack>
                                {log.success ? (
                                  <FaCheckCircle size={12} color={iconColor} />
                                ) : (
                                  <FaTimesCircle size={12} color="red" />
                                )}
                              </HStack>
                              <Text fontSize="sm" color="black" fontWeight="medium">
                                {log.message}
                              </Text>
                              {log.details && (
                                <Text fontSize="xs" color="gray.600" mt={0.5}>
                                  {log.details}
                                </Text>
                              )}
                              {log.result && (
                                <Text fontSize="xs" color={iconColor} mt={0.5} fontWeight="semibold">
                                  {log.result}
                                </Text>
                              )}
                            </Box>
                              );
                            })}
                          </VStack>
                        ) : (
                          <Text fontSize="xs" color="gray.500" mt={2}>No calculations yet</Text>
                        )}
                      </CollapsibleContent>
                    </Box>
                  </CollapsibleRoot>
                );
              })}
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
};
