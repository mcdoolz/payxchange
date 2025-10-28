import { Box, HStack, Text } from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react/native-select';
import { FaExchangeAlt } from 'react-icons/fa';
import { usePayments } from '../context/PaymentContext';
import { CURRENCIES } from '../services/exchangeRate';

export const CurrencySelector = () => {
  const { baseCurrency, targetCurrency, setBaseCurrency, setTargetCurrency } = usePayments();

  return (
    <HStack gap={4} mb={6}>
      <Box>
        <Text fontSize="sm" mb={1} color="black" fontWeight="medium">From</Text>
        <NativeSelectRoot size="lg">
          <NativeSelectField 
            value={baseCurrency} 
            onChange={(e) => setBaseCurrency(e.target.value)}
            color="black"
            bg="white"
            px={4}
            py={2}
          >
            {CURRENCIES.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
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
            onChange={(e) => setTargetCurrency(e.target.value)}
            color="black"
            bg="white"
            px={4}
            py={2}
          >
            {CURRENCIES.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
      </Box>
    </HStack>
  );
};
