import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeDialog } from '../add-employee-dialog/add-employee-dialog';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.css'],
  standalone: false,
})
export class UserDetails {
  userId: string = '';
  userList: any[] = [];
  filteredUsers: any[] = [];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUsers = localStorage.getItem('userList');
      if (storedUsers) {
        this.userList = JSON.parse(storedUsers);
        this.filteredUsers = [...this.userList];
        return;
      }
    }
    this.http.get<any[]>('assets/user-list.json').subscribe((data) => {
      this.userList = data;
      this.filteredUsers = [...this.userList];
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('userList', JSON.stringify(this.userList));
      }
    });
  }

  onSearch() {
    const search = this.userId.trim().toLowerCase();
    this.filteredUsers = search
      ? this.userList.filter((user) =>
          user.userId.toLowerCase().includes(search)
        )
      : [...this.userList];
  }

  onAddEmployee() {
    const dialogRef = this.dialog.open(AddEmployeeDialog, { width: '400px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngZone.run(() => {
          this.userList.push(result);
          this.filteredUsers = [...this.userList];

          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('userList', JSON.stringify(this.userList));
          }
          this.cdr.detectChanges();
        });
      }
    });
  }

deleteUser(index: number) {
  this.userList.splice(index, 1);
  this.filteredUsers = [...this.userList];

  // Update localStorage if applicable
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('userList', JSON.stringify(this.userList));
  }

  this.cdr.detectChanges(); // trigger change detection if needed
}

onEditEmployee(user: any, index: number) {
  const dialogRef = this.dialog.open(AddEmployeeDialog, {
    width: '400px',
    data: { ...user } // pass user data to dialog
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.userList[index] = result; // update the edited user
      this.filteredUsers = [...this.userList];

      // Save to localStorage if you use it
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('userList', JSON.stringify(this.userList));
      }

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }
  });
}


}
