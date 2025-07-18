import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-employee-dialog',
  templateUrl: './add-employee-dialog.html',
  styleUrls: ['./add-employee-dialog.css'],
  standalone: false,
})
export class AddEmployeeDialog implements AfterViewInit, OnInit {

  employee = {
    EAN: '',
    Shelflife: '',
    sku: '',
    skucode: '',
  };

  constructor(
    private dialogRef: MatDialogRef<AddEmployeeDialog>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any // <-- Inject data here
  ) {}

  ngOnInit() {
    console.log(this.data, "this.daaaa...")
    if (this.data) {
      this.employee = { ...this.data }; // <-- Initialize form fields with data
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    if (
      this.employee.EAN &&
      this.employee.Shelflife &&
      this.employee.sku && 
      this.employee.skucode
    ) {
      this.dialogRef.close(this.employee);
    }
  }
}
