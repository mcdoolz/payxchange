import { useState, useEffect } from 'react';
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react/native-select';
import { usePayments } from '../context/PaymentContext';
import { DateRangePicker } from './DateRangePicker';

const FREQUENCIES = ['Daily', 'Weekly', 'Bi-Weekly', 'Semi-Monthly', 'Monthly', 'Quarterly', 'Annually'];

export const PaymentForm = ({ editData, onCancelEdit, isCalculating }) => {
  const { addPayment, baseCurrency } = usePayments();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    amount: '',
    frequency: 'Monthly',
    semiMonthlyDay1: 1,
    semiMonthlyDay2: 15,
  });

  // Update form when editData changes
  useEffect(() => {
    if (editData) {
      setFormData({
        startDate: editData.startDate || '',
        endDate: editData.endDate || '',
        amount: editData.amount || '',
        frequency: editData.frequency || 'Monthly',
        semiMonthlyDay1: editData.semiMonthlyDay1 || 1,
        semiMonthlyDay2: editData.semiMonthlyDay2 || 15,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Reset semi-monthly days when switching away from Semi-Monthly
      if (name === 'frequency' && value !== 'Semi-Monthly') {
        updated.semiMonthlyDay1 = 1;
        updated.semiMonthlyDay2 = 15;
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Start date value:', formData.startDate);
    console.log('End date value:', formData.endDate);
    
    if (!formData.startDate || !formData.endDate || !formData.amount) {
      console.log('Missing required fields');
      alert('Please fill in all required fields. End date appears to be invalid - check that the date is valid (e.g., June only has 30 days, not 31).');
      return;
    }

    // Validate dates - parse properly
    const [startYear, startMonth, startDay] = formData.startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = formData.endDate.split('-').map(Number);
    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert('Please enter valid dates');
      return;
    }
    
    if (start > end) {
      alert('Start date must be before or equal to end date');
      return;
    }
    
    if (parseFloat(formData.amount) <= 0) {
      alert('Amount must be greater than zero');
      return;
    }

    console.log('Validation passed, adding payment');
    
    const paymentData = {
      ...formData,
      amount: parseFloat(formData.amount),
      startDate: formData.startDate,
      endDate: formData.endDate,
      baseCurrency,
    };
    // Include semi-monthly days only when relevant
    if (formData.frequency === 'Semi-Monthly') {
      paymentData.semiMonthlyDay1 = parseInt(formData.semiMonthlyDay1, 10) || 1;
      paymentData.semiMonthlyDay2 = parseInt(formData.semiMonthlyDay2, 10) || 15;
    }
    addPayment(paymentData);

    setFormData({
      startDate: '',
      endDate: '',
      amount: '',
      frequency: 'Monthly',
      semiMonthlyDay1: 1,
      semiMonthlyDay2: 15,
    });
    
    // Clear edit mode if we were editing
    if (editData && onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} noValidate bg="white" p={6} borderRadius="lg" shadow="md" mb={6}>
      <VStack gap={4}>
        <DateRangePicker
          startDate={formData.startDate}
          endDate={formData.endDate}
          onStartDateChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
          onEndDateChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
          label="Payment Date Range *"
        />

        {formData.frequency === 'Semi-Monthly' && (
          <Box
            w="full"
            overflow="hidden"
            transition="all 0.3s ease-in-out"
            opacity={1}
            maxH="80px"
            css={{
              animation: 'fadeSlideIn 0.3s ease-in-out',
              '@keyframes fadeSlideIn': {
                from: { opacity: 0, maxHeight: '0px', marginTop: '0' },
                to: { opacity: 1, maxHeight: '80px', marginTop: 'var(--chakra-space-0)' },
              },
            }}
          >
            <HStack gap={4}>
              <Box flex={1}>
                <Text fontSize="xs" mb={1} fontWeight="medium" color="gray.600">Pay Day 1</Text>
                <Input
                  type="number"
                  name="semiMonthlyDay1"
                  value={formData.semiMonthlyDay1}
                  onChange={handleChange}
                  min={1}
                  max={31}
                  color="black"
                  bg="white"
                  size="sm"
                  w="80px"
                  textAlign="center"
                />
              </Box>
              <Box flex={1}>
                <Text fontSize="xs" mb={1} fontWeight="medium" color="gray.600">Pay Day 2</Text>
                <Input
                  type="number"
                  name="semiMonthlyDay2"
                  value={formData.semiMonthlyDay2}
                  onChange={handleChange}
                  min={1}
                  max={31}
                  color="black"
                  bg="white"
                  size="sm"
                  w="80px"
                  textAlign="center"
                />
              </Box>
            </HStack>
          </Box>
        )}

        <HStack w="full" gap={4}>
          <Box flex={1}>
            <Text fontSize="sm" mb={1} fontWeight="medium" color="black">Amount *</Text>
            <Input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              color="black"
              bg="white"
              _focus={{ color: "black", bg: "white" }}
              size="lg"
              px={4}
              py={2}
            />
          </Box>

          <Box flex={1}>
            <Text fontSize="sm" mb={1} fontWeight="medium" color="black">Frequency *</Text>
            <NativeSelectRoot size="lg">
              <NativeSelectField 
                name="frequency" 
                value={formData.frequency} 
                onChange={handleChange}
                color="black"
                bg="white"
                px={4}
                py={2}
              >
                {FREQUENCIES.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>
        </HStack>

        <HStack w="full" gap={4}>
          <Button
            type="submit"
            colorScheme="blue"
            flex={editData ? 1 : 'auto'}
            w={editData ? 'auto' : 'full'}
            size="lg"
            py={6}
            disabled={isCalculating}
            opacity={isCalculating ? 0.6 : 1}
            cursor={isCalculating ? 'not-allowed' : 'pointer'}
          >
            {isCalculating 
              ? 'Calculating...' 
              : editData 
                ? 'Update Payment Entry' 
                : 'Add Payment Entry'
            }
          </Button>
          
          {editData && (
            <Button
              type="button"
              colorScheme="gray"
              variant="outline"
              flex={1}
              size="lg"
              py={6}
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};
