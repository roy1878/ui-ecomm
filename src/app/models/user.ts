import { Address } from './address';

export interface User {
  id?: number;
  FirstName: string;
  LastName: string;
  email: string;
  userAddress: Address;
}
