import { useState } from 'react'
import { Box, Grid, Heading, VStack } from '@chakra-ui/react'
import { CurrencySelector } from './components/CurrencySelector'
import { PaymentForm } from './components/PaymentForm'
import { PaymentList } from './components/PaymentList'
import { LogPanel } from './components/LogPanel'
import { Logo } from './components/Logo'
import { Footer } from './components/Footer'
import { usePayments } from './context/PaymentContext'

function App() {
  const { apiLogs } = usePayments();
  const [editData, setEditData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleEdit = (paymentData) => {
    setEditData(paymentData);
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleCalculatingChange = (calculating) => {
    setIsCalculating(calculating);
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8} w="100vw" display="flex" flexDirection="column">
      <Box maxW="100%" w="100%" px={8} flex="1">
        <Box textAlign="center" mb={6}>
          <Logo size="lg" />
          <Heading size="md" fontWeight="normal" color="gray.700" mt={3}>
            Historical Currency Conversion Calculator
          </Heading>
        </Box>
        
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} w="100%">
          <VStack gap={6} align="stretch">
            <CurrencySelector />
            <PaymentForm 
              editData={editData} 
              onCancelEdit={handleCancelEdit}
              isCalculating={isCalculating}
            />
            <PaymentList 
              onEdit={handleEdit}
              onCalculatingChange={handleCalculatingChange}
            />
          </VStack>
          
          <Box h="calc(100vh - 280px)" minH="600px" maxH="800px">
            <LogPanel apiLogs={apiLogs} />
          </Box>
        </Grid>
      </Box>
      
      <Footer />
    </Box>
  )
}

export default App

