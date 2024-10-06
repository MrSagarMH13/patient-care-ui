// services/patient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, PatientResponse } from '../models/interface/patient.model';
import { API_URL, PATIENTS_ENDPOINT } from '../constant/api.constants';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = API_URL;

  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<PatientResponse> {
    return this.http.get<PatientResponse>(
      `${this.apiUrl}${PATIENTS_ENDPOINT.GET_ALL}`
    );
  }

  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(
      `${this.apiUrl}${PATIENTS_ENDPOINT.GET_BY_ID.replace(
        ':id',
        id.toString()
      )}`
    );
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(
      `${this.apiUrl}${PATIENTS_ENDPOINT.CREATE}`,
      patient
    );
  }

  updatePatient(patientId: string, patient: Patient): Observable<Patient> {
    if (patient) {
      return this.http.put<Patient>(
        `${this.apiUrl}${PATIENTS_ENDPOINT.UPDATE.replace(':id', patientId)}`,
        patient
      );
    } else {
      throw new Error('Patient ID is required for update operation');
    }
  }

  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${PATIENTS_ENDPOINT.DELETE.replace(':id', id)}`
    );
  }

  searchPatients(searchTerm: string): Observable<PatientResponse> {
    return this.http.get<PatientResponse>(
      `${this.apiUrl}${PATIENTS_ENDPOINT.SEARCH}?name=${searchTerm}`
    );
  }
}
