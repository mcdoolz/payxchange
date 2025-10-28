import { useState, useEffect } from 'react';
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react/native-select';
import { usePayments } from '../context/PaymentContext';
import { DateRangePicker } from './DateRangePicker';

const FREQUENCIES = ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Annually'];

export const PaymentForm = ({ editData, onCancelEdit }) => {
  const { addPayment, baseCurrency } = usePayments();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    amount: '',
    frequency: 'Monthly',
  });

  // Update form when editData changes
  useEffect(() => {
    if (editData) {
      setFormData({
        startDate: editData.startDate || '',
        endDate: editData.endDate || '',
        amount: editData.amount || '',
        frequency: editData.frequency || 'Monthly',
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
    
    addPayment({
      ...formData,
      amount: parseFloat(formData.amount),
      startDate: formData.startDate,
      endDate: formData.endDate,
      baseCurrency,
    });

    setFormData({
      startDate: '',
      endDate: '',
      amount: '',
      frequency: 'Monthly',
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
          >
            {editData ? 'Update Payment Entry' : 'Add Payment Entry'}
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
