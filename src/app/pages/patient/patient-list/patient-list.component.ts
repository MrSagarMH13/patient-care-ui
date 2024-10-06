import {Component, OnInit} from '@angular/core';
import {
  Patient,
  PatientResponse,
} from '../../../core/models/interface/patient.model';
import {PatientService} from '../../../core/services/patient.service';
import {Router, RouterModule} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {SnackbarService} from '../../../core/services/snack-bar.service';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
  imports: [RouterModule, SharedModule, FormsModule],
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';
  noResults: boolean = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {
  }

  ngOnInit() {
    this.loadPatients();
  }

  // Extracted method for loading patients
  loadPatients() {
    this.patientService.getAllPatients().subscribe(
      (response: PatientResponse) => {
        if (response.code === 200) {
          this.filteredPatients = response.data;
          this.noResults = this.filteredPatients.length === 0;
        }
      },
      (error) => {
        console.error('Error fetching patients:', error);
        this.noResults = true;
      }
    );
  }


  onSearch() {
    if (this.searchTerm.length >= 3) {
      this.patientService.searchPatients(this.searchTerm).subscribe(
        (response: PatientResponse) => {
          if (response.code === 200) {
            this.filteredPatients = response.data;
            this.noResults = this.filteredPatients.length === 0;
          }
        },
        (error) => {
          console.error('Error fetching patients:', error);
          this.noResults = true;
        }
      );
    } else {
      // this.filteredPatients = [];
      this.noResults = false;
    }
  }

  deletePatient(id: string) {
    const patientToDelete = this.filteredPatients.find(
      (patient) => patient.id === id
    );
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Patient',
        message: `Are you sure you want to delete patient ${patientToDelete?.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.patientService.deletePatient(id).subscribe(
          () => {
            this.filteredPatients = this.filteredPatients.filter(
              (patient) => patient.id !== id
            );

            this.snackbarService.show(
              `${patientToDelete?.name} has been deleted.`,
              false
            );
            this.loadPatients();
          },
          (error) => {
            console.error('Error deleting patient:', error);
            this.snackbarService.show(
              `Failed to delete ${patientToDelete?.name}.`,
              true
            );
          }
        );
      }
    });
  }

  navigateToUpdatePatient(id: string) {
    this.router.navigate(['/update', id]).then(() => {
      this.loadPatients();  // Refresh the list when navigating back
    });
  }
  navigateToAddPatient() {
    this.router.navigate(['/new']).then(() => {
      this.loadPatients();  // Refresh the list when navigating back
    });
  }
}
