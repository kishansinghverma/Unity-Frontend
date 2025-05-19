import React, { forwardRef } from 'react';
import {
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  FormErrorMessage,
  FormHelperText,
  SelectProps as ChakraSelectProps,
} from '@chakra-ui/react';

interface SelectProps extends ChakraSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, required, ...props }, ref) => {
    return (
      <FormControl isInvalid={!!error} isRequired={required}>
        {label && <FormLabel>{label}</FormLabel>}
        <ChakraSelect ref={ref} {...props}>
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </ChakraSelect>
        {error ? (
          <FormErrorMessage>{error}</FormErrorMessage>
        ) : helperText ? (
          <FormHelperText>{helperText}</FormHelperText>
        ) : null}
      </FormControl>
    );
  }
);

Select.displayName = 'Select';

export default Select;