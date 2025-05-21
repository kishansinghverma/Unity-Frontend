import { v4 as uuidv4 } from 'uuid';

// Mock data for gate passes
const mockGatePasses = [
  {
    id: '1',
    date: '2023-05-10',
    seller: 'राम किसान',
    vehicle: 'UP32 BT 3456',
    type: 'ट्रक',
    party: 'आदित्य ट्रेडिंग कंपनी',
    bags: '45',
    weight: '22.5',
  },
  {
    id: '2',
    date: '2023-05-11',
    seller: 'श्याम सिंह',
    vehicle: 'UP32 AT 7890',
    type: 'पिकअप',
    party: 'आदित्य एग्रो इंडस्ट्रीज़',
    bags: '30',
    weight: '15.0',
  },
  {
    id: '3',
    date: '2023-05-12',
    seller: 'सुरेश वर्मा',
    vehicle: 'UP32 CT 1234',
    type: 'ट्रैक्टर',
    party: 'आदित्य फ़ूड्स',
    bags: '22',
    weight: '11.0',
  },
  {
    id: '4',
    date: '2023-05-13',
    seller: 'प्रकाश राय',
    vehicle: 'UP32 DT 5678',
    type: 'ट्रक',
    party: 'आदित्य ट्रेडिंग कंपनी',
    bags: '60',
    weight: '30.0',
  },
  {
    id: '5',
    date: '2023-05-14',
    seller: 'अजय कुमार',
    vehicle: 'UP32 ET 9012',
    type: 'पिकअप',
    party: 'आदित्य एग्रो इंडस्ट्रीज़',
    bags: '25',
    weight: '12.5',
  },
];

export const getMockGatePasses = () => {
  // Return copy of the data
  return [...mockGatePasses];
};

export const getMockGatePassById = (id: string) => {
  return mockGatePasses.find(gatePass => gatePass.id === id);
};

export const createMockGatePass = (gatePassData: any) => {
  const newGatePass = {
    id: uuidv4(),
    ...gatePassData,
  };
  
  // In a real app, you would add this to the database
  // mockGatePasses.push(newGatePass);
  
  return newGatePass;
};

export const updateMockGatePass = (id: string, gatePassData: any) => {
  // In a real app, you would update the database
  const gatePassIndex = mockGatePasses.findIndex(gatePass => gatePass.id === id);
  
  if (gatePassIndex !== -1) {
    const updatedGatePass = {
      ...mockGatePasses[gatePassIndex],
      ...gatePassData,
    };
    
    // mockGatePasses[gatePassIndex] = updatedGatePass;
    return updatedGatePass;
  }
  
  return null;
};

export const deleteMockGatePass = (id: string) => {
  // In a real app, you would delete from the database
  const gatePassIndex = mockGatePasses.findIndex(gatePass => gatePass.id === id);
  
  if (gatePassIndex !== -1) {
    // mockGatePasses.splice(gatePassIndex, 1);
    return true;
  }
  
  return false;
};
