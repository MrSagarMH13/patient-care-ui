// import { Gender } from '../../enums/gender.enum';

export interface Patient {
  id?: string;
  name: string;
  birthdate: string;
  gender: string;
  phone: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export type PatientResponse = ApiResponse<Patient[]>;