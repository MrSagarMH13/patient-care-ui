import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PatientService} from '../../../core/services/patient.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Patient} from '../../../core/models/interface/patient.model';
import {SnackbarService} from '../../../core/services/snack-bar.service';
import {SharedModule} from '../../../shared/shared.module';
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-patient-form',
  standalone: true,
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
  imports: [SharedModule],
})
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup;
  patientId?: string;
  validationMessages: { [key: string]: string } = {};
  maxDate: Date | undefined;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      birthdate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });

    this.setValidationMessages();
  }

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.patientId) {
      this.loadPatientData(this.patientId);
    }

    this.maxDate = new Date();
  }

  setValidationMessages() {
    this.patientForm.get('firstName')?.statusChanges.subscribe((status) => {
      this.validationMessages['firstName'] =
        status === 'INVALID' ? 'First name is required (min 3 characters)' : '';
    });

    this.patientForm.get('lastName')?.statusChanges.subscribe((status) => {
      this.validationMessages['lastName'] =
        status === 'INVALID' ? 'Last name is required (min 3 characters)' : '';
    });

    this.patientForm.get('birthdate')?.statusChanges.subscribe((status) => {
      this.validationMessages['birthdate'] =
        status === 'INVALID' ? 'Birthdate is required' : '';
    });

    this.patientForm.get('gender')?.statusChanges.subscribe((status) => {
      this.validationMessages['gender'] =
        status === 'INVALID' ? 'Gender is required' : '';
    });

    this.patientForm.get('phone')?.statusChanges.subscribe((status) => {
      this.validationMessages['phone'] =
        status === 'INVALID' ? 'Phone number is required (10 digits)' : '';
    });
  }

  loadPatientData(id: string) {
    this.patientService.getPatient(id).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          const patient = response.data;
          const [firstName, ...lastNameParts] = patient.name.split(' ');
          const lastName = lastNameParts.join(' ');

          this.patientForm.patchValue({
            firstName,
            lastName,
            birthdate: patient.birthdate,
            gender: patient.gender,
            phone: patient.phone,
          });
        }
      },
      error: (err) => {
        this.snackbarService.show(
          'Error loading patient data: ' + err.message,
          true
        );
      },
    });
  }

  goBack() {
    this.router.navigate(['']);
  }

  submitForm() {
    if (this.patientForm.valid) {
      const formValues = this.patientForm.value;
      const patient: Patient = {
        ...formValues,
        name: `${formValues.firstName} ${formValues.lastName}`,
      };

      const birthdateControl = this.patientForm.get('birthdate');
      if (birthdateControl?.value) {
        // Format the birthdate to 'YYYY-MM-DD'
        const formattedBirthdate = formatDate(birthdateControl.value, 'yyyy-MM-dd', 'en');
        this.patientForm.patchValue({
          birthdate: formattedBirthdate,
        });
      }
      if (this.patientId) {
        this.patientService.updatePatient(this.patientId, patient).subscribe({
          next: () => {
            this.snackbarService.show('Patient updated successfully!');
            this.router.navigate(['']);
          },
          error: (err) => {
            this.snackbarService.show(
              'Error updating patient: ' + err.message,
              true
            );
          },
        });
      } else {
        this.patientService.createPatient(patient).subscribe({
          next: () => {
            this.snackbarService.show('Patient created successfully!');
            this.router.navigate(['']);
          },
          error: (err) => {
            this.snackbarService.show(
              'Error creating patient: ' + err.message,
              true
            );
          },
        });
      }
    }
  }
}
