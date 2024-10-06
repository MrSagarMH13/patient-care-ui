import { Routes } from '@angular/router';
import { PatientListComponent } from './pages/patient/patient-list/patient-list.component';
import { PatientFormComponent } from './pages/patient/patient-form/patient-form.component';

export const routes: Routes = [
  { path: '', component: PatientListComponent },
  { path: 'new', component: PatientFormComponent },
  { path: 'update/:id', component: PatientFormComponent }
];