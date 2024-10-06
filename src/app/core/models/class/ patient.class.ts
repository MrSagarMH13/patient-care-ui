import { Patient } from '../interface/patient.model';

export class PatientClass implements Patient {
  id: string;
  name: string;
  birthdate: string;
  gender: string;
  phone: string;

  constructor(
    id: string,
    name: string,
    birthdate: string,
    gender: string,
    phone: string
  ) {
    this.id = id;
    this.name = name;
    this.birthdate = birthdate;
    this.gender = gender;
    this.phone = phone;
  }
}
