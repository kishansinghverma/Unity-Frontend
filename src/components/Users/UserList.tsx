import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { Edit2, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export const UserList = () => {
  const users = useSelector((state: RootState) => state.users.users);

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>
                <IconButton
                  icon={<Edit2 size={16} />}
                  aria-label="Edit user"
                  size="sm"
                  mr={2}
                  colorScheme="blue"
                  variant="ghost"
                />
                <IconButton
                  icon={<Trash2 size={16} />}
                  aria-label="Delete user"
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};