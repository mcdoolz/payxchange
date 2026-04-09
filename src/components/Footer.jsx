import { Box, HStack, Link, Text } from '@chakra-ui/react';
import { FaGithub, FaEnvelope } from 'react-icons/fa';

export const Footer = () => {
  return (
    <Box 
      as="footer" 
      w="100%" 
      py={6} 
      mt={8} 
      borderTop="1px solid" 
      borderColor="gray.200"
      bg="white"
    >
      <HStack justify="center" gap={8} flexWrap="wrap">
        <HStack gap={2}>
          <FaEnvelope color="gray" />
          <Link 
            href="mailto:apouriliaee@gmail.com" 
            color="blue.600" 
            fontWeight="medium"
            _hover={{ color: "blue.800" }}
          >
            apouriliaee@gmail.com
          </Link>
        </HStack>
        
        <HStack gap={2}>
          <FaGithub color="gray" />
          <Link 
            href="https://github.com/mcdoolz/payxchange" 
            target="_blank" 
            rel="noopener noreferrer"
            color="blue.600" 
            fontWeight="medium"
            _hover={{ color: "blue.800" }}
          >
            github.com/mcdoolz/payxchange
          </Link>
        </HStack>
      </HStack>
      
      <Text textAlign="center" mt={3} fontSize="sm" color="gray.600">
        © {new Date().getFullYear()} PayXChange — Digital Forge Studios Inc. Historical Currency Conversion Calculator.
      </Text>
    </Box>
  );
};
