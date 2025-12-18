export interface Unit {
  id: string;
  unitNumber: string;
  unitType: string;
  floor: string;
  entrance: string | null;
  sizeM2: number;
  coOwnershipShare: string;
  constructionYear: number | null;
  roomCount: number;
}

export interface BuildingWithUnits {
  id: string;
  name: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  units: Unit[];
}

export interface Property {
  id:string;
  propertyNumber: string;
  name: string;
  managementType: string;
  propertyManager: string;
  accountant: string;
  buildings?: BuildingWithUnits[];
}