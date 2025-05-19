import React from 'react';
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

interface ButtonProps extends Omit<ChakraButtonProps, 'leftIcon' | 'rightIcon'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  isLoading = false,
  variant = 'solid',
  size = 'md',
  ...props
}) => {
  return (
    <ChakraButton
      leftIcon={leftIcon ? <span className="mr-2">{leftIcon}</span> : undefined}
      rightIcon={rightIcon ? <span className="ml-2">{rightIcon}</span> : undefined}
      isLoading={isLoading}
      variant={variant}
      size={size}
      colorScheme="blue"
      {...props}
    >
      {children}
    </ChakraButton>
  );
};

export default Button;