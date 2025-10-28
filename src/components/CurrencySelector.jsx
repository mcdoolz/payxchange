import { Box, HStack, Text } from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react/native-select';
import { FaExchangeAlt } from 'react-icons/fa';
import { usePayments } from '../context/PaymentContext';
import { CURRENCIES } from '../services/exchangeRate';

export const CurrencySelector = () => {
  const { baseCurrency, targetCurrency, setBaseCurrency, setTargetCurrency } = usePayments();

  const handleBaseCurrencyChange = (e) => {
    const newBase = e.target.value;
    if (newBase === targetCurrency) {
      // If selecting the same currency as target, swap them
      setTargetCurrency(baseCurrency);
    }
    setBaseCurrency(newBase);
  };

  const handleTargetCurrencyChange = (e) => {
    const newTarget = e.target.value;
    if (newTarget === baseCurrency) {
      // If selecting the same currency as base, swap them
      setBaseCurrency(targetCurrency);
    }
    setTargetCurrency(newTarget);
  };

  return (
    <HStack gap={4} mb={6}>
      <Box>
        <Text fontSize="sm" mb={1} color="black" fontWeight="medium">From</Text>
        <NativeSelectRoot size="lg">
          <NativeSelectField 
            value={baseCurrency} 
            onChange={handleBaseCurrencyChange}
            color="black"
            bg="white"
            px={4}
            py={2}
          >
            {CURRENCIES.map(curr => (
              <option key={curr} value={curr} disabled={curr === targetCurrency}>
                {curr}{curr === targetCurrency ? ' (selected as target)' : ''}
              </option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
      </Box>
      
      <Box pt={6} color="black">
        <FaExchangeAlt />
      </Box>
      
      <Box>
        <Text fontSize="sm" mb={1} color="black" fontWeight="medium">To</Text>
        <NativeSelectRoot size="lg">
          <NativeSelectField 
            value={targetCurrency} 
            onChange={handleTargetCurrencyChange}
            color="black"
            bg="white"
            px={4}
            py={2}
          >
            {CURRENCIES.map(curr => (
              <option key={curr} value={curr} disabled={curr === baseCurrency}>
                {curr}{curr === baseCurrency ? ' (selected as base)' : ''}
              </option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
      </Box>
    </HStack>
  );
};
