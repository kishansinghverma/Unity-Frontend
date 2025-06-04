import { v4 as uuidv4 } from 'uuid';

// Mock data for parties
const mockParties = [
  {
    id: '1',
    name: 'A/344 New Sabzi Mandi',
    mandi: 'Azadpur',
    state: 'Delhi',
    distance: '193',
    licence: '',
  },
  {
    id: '2',
    name: 'ATR Traders',
    mandi: 'Jabalpur',
    state: 'Chhattishgarh',
    distance: '636',
    licence: '',
  },
  {
    id: '3',
    name: 'Aashish Aalu Bhandar',
    mandi: 'Neemach',
    state: 'Madhya Pradesh',
    distance: '642',
    licence: '',
  },
  {
    id: '4',
    name: 'Agra Aalu Company',
    mandi: 'Ashok Nagar',
    state: 'Madhya Pradesh',
    distance: '2004',
    licence: '',
  },
  {
    id: '5',
    name: 'Arjun Das Kotu Mal',
    mandi: 'Nandurbar',
    state: 'Maharashtra',
    distance: '928',
    licence: '',
  },
  {
    id: '6',
    name: 'Arjun Trading Company',
    mandi: 'Amarpur',
    state: 'Bihar',
    distance: '1101',
    licence: '',
  },
  {
    id: '7',
    name: 'BP Tomato Company',
    mandi: 'Jhajjar',
    state: 'Haryana',
    distance: '223',
    licence: '',
  },
  {
    id: '8',
    name: 'Bankey Bihari Trader Raipur',
    mandi: 'Raipur',
    state: 'Chhattishgarh',
    distance: '992',
    licence: '',
  },
];

export const getMockParties = () => {
  // Return copy of the data
  return [...mockParties];
};

export const getMockPartyById = (id: string) => {
  return mockParties.find(party => party.id === id);
};

export const createMockParty = (partyData: any) => {
  const newParty = {
    id: uuidv4(),
    ...partyData,
  };
  
  // In a real app, you would add this to the database
  // mockParties.push(newParty);
  
  return newParty;
};

export const updateMockParty = (id: string, partyData: any) => {
  // In a real app, you would update the database
  const partyIndex = mockParties.findIndex(party => party.id === id);
  
  if (partyIndex !== -1) {
    const updatedParty = {
      ...mockParties[partyIndex],
      ...partyData,
    };
    
    // mockParties[partyIndex] = updatedParty;
    return updatedParty;
  }
  
  return null;
};

export const deleteMockParty = (id: string) => {
  // In a real app, you would delete from the database
  const partyIndex = mockParties.findIndex(party => party.id === id);
  
  if (partyIndex !== -1) {
    // mockParties.splice(partyIndex, 1);
    return true;
  }
  
  return false;
};
