import { v4 as uuidv4 } from 'uuid';

// Mock data for processed records
const mockProcessedRecords = [
  {
    id: '1',
    date: '2025-05-17',
    seller: 'Yash Rawal',
    vehicle: 'JH02AQ1494',
    party: 'Sankat Mochan Traders, Bihar Sarif, Nalanda',
    bags: '600',
    weight: '300',
    rate: '870',
    amount: '3915',
    mode: 'Postpaid',
  },
  {
    id: '2',
    date: '2025-05-10',
    seller: 'Yash Rawal',
    vehicle: 'TG01T0110',
    party: 'R.K Aalu Company, Nizamabad',
    bags: '240',
    weight: '120',
    rate: '870',
    amount: '1566',
    mode: 'Postpaid',
  },
  {
    id: '3',
    date: '2025-05-08',
    seller: 'N.S',
    vehicle: 'TS16UC7586',
    party: 'R.K Aalu Company, Nizamabad',
    bags: '240',
    weight: '120',
    rate: '870',
    amount: '1566',
    mode: 'Postpaid',
  },
  {
    id: '4',
    date: '2025-05-06',
    seller: 'N.S',
    vehicle: 'TG01T0911',
    party: 'J.Srinivas Sabji Mandi Kamareddy, Kamareddy',
    bags: '240',
    weight: '120',
    rate: '870',
    amount: '1566',
    mode: 'Postpaid',
  },
  {
    id: '5',
    date: '2025-05-03',
    seller: 'N.S',
    vehicle: 'UP34CT8677',
    party: 'J.Srinivas Sabji Mandi Kamareddy, Kamareddy',
    bags: '240',
    weight: '120',
    rate: '870',
    amount: '1566',
    mode: 'Postpaid',
  },
  {
    id: '6',
    date: '2025-05-02',
    seller: 'N.S',
    vehicle: 'MP07HB3429',
    party: 'New Askan Alu Tradesh, Beed',
    bags: '380',
    weight: '190',
    rate: '870',
    amount: '2480',
    mode: 'Postpaid',
  },
  {
    id: '7',
    date: '2025-04-30',
    seller: 'Yash Rawal',
    vehicle: 'TG01T0621',
    party: 'J.Srinivas Sabji Mandi Kamareddy, Kamareddy',
    bags: '180',
    weight: '90',
    rate: '870',
    amount: '1175',
    mode: 'Postpaid',
  },
  {
    id: '8',
    date: '2025-04-26',
    seller: 'Yash Rawal',
    vehicle: 'RJ11GA9572',
    party: 'J.Srinivas Sabji Mandi Kamareddy, Kamareddy',
    bags: '365',
    weight: '190',
    rate: '870',
    amount: '2480',
    mode: 'Postpaid',
  },
];

export const getMockProcessedRecords = () => {
  // Return copy of the data
  return [...mockProcessedRecords];
};

export const getMockProcessedRecordById = (id: string) => {
  return mockProcessedRecords.find(record => record.id === id);
};

export const createMockProcessedRecord = (recordData: any) => {
  const newRecord = {
    id: uuidv4(),
    ...recordData,
  };
  
  // In a real app, you would add this to the database
  // mockProcessedRecords.push(newRecord);
  
  return newRecord;
};

export const updateMockProcessedRecord = (id: string, recordData: any) => {
  // In a real app, you would update the database
  const recordIndex = mockProcessedRecords.findIndex(record => record.id === id);
  
  if (recordIndex !== -1) {
    const updatedRecord = {
      ...mockProcessedRecords[recordIndex],
      ...recordData,
    };
    
    // mockProcessedRecords[recordIndex] = updatedRecord;
    return updatedRecord;
  }
  
  return null;
};

export const deleteMockProcessedRecord = (id: string) => {
  // In a real app, you would delete from the database
  const recordIndex = mockProcessedRecords.findIndex(record => record.id === id);
  
  if (recordIndex !== -1) {
    // mockProcessedRecords.splice(recordIndex, 1);
    return true;
  }
  
  return false;
}; 