export interface LegalData {
  property: {
    name: string;
    propertyNumber: string;
    managementType: 'WEG' | 'MV';
    propertyManager: string;
    accountant: string;
  };
  buildings: {
    name: string;
    street: string;
    houseNumber: string;
    zipCode: string;
    city: string;
  }[];
  units: {
    unitNumber: string;
    type: 'Apartment' | 'Office' | 'Garden' | 'Parking';
    floor: string;
    size: number;
    coOwnership: string;
    rooms: number;
    buildingIndex: number;
  }[];
}
