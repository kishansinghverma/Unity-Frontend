import React from 'react';
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Flex,
  Icon,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ListColumn, SortConfig } from '../../types';

interface TableProps<T extends { id: string }> {
  data: T[];
  columns: ListColumn[];
  onRowClick?: (item: T) => void;
  sortConfig?: SortConfig;
  onSort?: (field: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

function Table<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  sortConfig,
  onSort,
  isLoading = false,
  emptyMessage = 'No data available'
}: TableProps<T>) {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="64" bg={useColorModeValue('white', 'gray.800')} borderRadius="lg">
        <Spinner />
      </Flex>
    );
  }

  if (data.length === 0) {
    return (
      <Flex
        direction="column"
        justify="center"
        align="center"
        h="64"
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="lg"
      >
        <Text color="gray.500">{emptyMessage}</Text>
      </Flex>
    );
  }

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      bg={useColorModeValue('white', 'gray.800')}
    >
      <Box overflowX="auto">
        <ChakraTable variant="simple">
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th key={column.id}>
                  <Flex align="center" cursor={column.sortable ? 'pointer' : 'default'}>
                    <Text onClick={() => column.sortable && onSort && onSort(column.accessor)}>
                      {column.label}
                    </Text>
                    {column.sortable && (
                      <Box ml={2}>
                        <Icon
                          as={ChevronUp}
                          w={3}
                          h={3}
                          color={
                            sortConfig?.field === column.accessor && sortConfig?.direction === 'asc'
                              ? 'blue.500'
                              : 'gray.400'
                          }
                        />
                        <Icon
                          as={ChevronDown}
                          w={3}
                          h={3}
                          mt="-2px"
                          color={
                            sortConfig?.field === column.accessor && sortConfig?.direction === 'desc'
                              ? 'blue.500'
                              : 'gray.400'
                          }
                        />
                      </Box>
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr
                key={item.id}
                onClick={() => onRowClick && onRowClick(item)}
                cursor={onRowClick ? 'pointer' : 'default'}
                _hover={{ bg: onRowClick ? hoverBg : 'transparent' }}
              >
                {columns.map((column) => (
                  <Td key={`${item.id}-${column.id}`}>
                    {item[column.accessor]}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </ChakraTable>
      </Box>
    </Box>
  );
}

export default Table;