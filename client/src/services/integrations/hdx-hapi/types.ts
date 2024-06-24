export interface AdminLevel1 {
  id: number;
  locationRef: number;
  code: string;
  name: string;
  locationCode: string;
  locationName: string;
}

export interface AdminLevel2 {
  id: number;
  locationRef: number;
  code: string;
  name: string;
  locationCode: string;
  locationName: string;
  admin1Ref: number;
  admin1Code: string;
  admin1Name: string;
}
