import React, { forwardRef } from 'react';
import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  FormErrorMessage,
  FormHelperText,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react';

interface InputProps extends ChakraInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, ...props }, ref) => {
    return (
      <FormControl isInvalid={!!error} isRequired={required}>
        {label && <FormLabel>{label}</FormLabel>}
        <ChakraInput ref={ref} {...props} />
        {error ? (
          <FormErrorMessage>{error}</FormErrorMessage>
        ) : helperText ? (
          <FormHelperText>{helperText}</FormHelperText>
        ) : null}
      </FormControl>
    );
  }
);

Input.displayName = 'Input';

export default Input;