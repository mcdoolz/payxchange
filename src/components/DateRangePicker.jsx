import { Box, HStack, Input, Text } from '@chakra-ui/react';

export const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange, label }) => {
  const handleDateChange = (value, onChange) => {
    // Only update if it's a complete date or empty
    if (!value || value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      onChange(value);
    }
  };

  return (
    <Box w="full">
      <Text fontSize="sm" mb={1} fontWeight="medium" color="black">{label}</Text>
      <HStack gap={2}>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => handleDateChange(e.target.value, onStartDateChange)}
          max="9999-12-31"
          placeholder="Start Date"
          size="lg"
          px={4}
          py={2}
          color="black"
          bg="white"
          _focus={{ color: "black", bg: "white" }}
        />
        <Text color="gray.500" fontWeight="medium">to</Text>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => handleDateChange(e.target.value, onEndDateChange)}
          max="9999-12-31"
          placeholder="End Date"
          size="lg"
          px={4}
          py={2}
          color="black"
          bg="white"
          _focus={{ color: "black", bg: "white" }}
        />
      </HStack>
    </Box>
  );
};
