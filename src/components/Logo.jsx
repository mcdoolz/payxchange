import { Box, HStack, Text } from '@chakra-ui/react';
import { FaExchangeAlt } from 'react-icons/fa';

export const Logo = ({ size = 'lg' }) => {
  const sizes = {
    sm: {
      icon: '20px',
      text: 'xl',
      box: '40px',
    },
    md: {
      icon: '28px',
      text: '2xl',
      box: '56px',
    },
    lg: {
      icon: '36px',
      text: '4xl',
      box: '72px',
    },
  };

  const currentSize = sizes[size] || sizes.lg;

  return (
    <HStack gap={3} justify="center">
      {/* Logo Icon */}
      <Box
        position="relative"
        w={currentSize.box}
        h={currentSize.box}
        borderRadius="xl"
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 4px 14px 0 rgba(102, 126, 234, 0.4)"
        transform="rotate(-5deg)"
        _hover={{
          transform: "rotate(0deg)",
          transition: "transform 0.3s ease"
        }}
      >
        <Box
          color="white"
          fontSize={currentSize.icon}
          transform="rotate(5deg)"
        >
          <FaExchangeAlt />
        </Box>
      </Box>

      {/* Logo Text */}
      <Box>
        <Text
          fontSize={currentSize.text}
          fontWeight="bold"
          color="black"
          letterSpacing="tight"
          lineHeight="1"
        >
          Pay<Text as="span" color="#667eea">X</Text>Change
        </Text>
      </Box>
    </HStack>
  );
};
