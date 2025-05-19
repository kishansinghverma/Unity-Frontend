import React, { ReactNode } from 'react';
import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  footer?: ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  className = '',
  footer
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      className={className}
      shadow="sm"
    >
      {(title || description) && (
        <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
          {title && <Heading size="md">{title}</Heading>}
          {description && (
            <Text mt={1} fontSize="sm" color="gray.500">
              {description}
            </Text>
          )}
        </Box>
      )}
      <Box p={4}>{children}</Box>
      {footer && (
        <Box
          p={4}
          borderTopWidth="1px"
          borderColor={borderColor}
          bg={useColorModeValue('gray.50', 'gray.700')}
        >
          {footer}
        </Box>
      )}
    </Box>
  );
};

export default Card;