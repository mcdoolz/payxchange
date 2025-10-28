import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import './index.css'
import App from './App.jsx'
import { PaymentProvider } from './context/PaymentContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <PaymentProvider>
        <App />
      </PaymentProvider>
    </ChakraProvider>
  </StrictMode>,
)
