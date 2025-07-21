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

  // ngOnInit() {
  //   if (typeof window !== 'undefined' && window.localStorage) {
  //     const storedUsers = localStorage.getItem('userList');
  //     if (storedUsers) {
  //       this.userList = JSON.parse(storedUsers);
  //       this.filteredUsers = [...this.userList];
  //       return;
  //     }
  //   }
  //   this.http.get<any[]>('assets/user-list.json').subscribe((data) => {
  //     this.userList = data;
  //     this.filteredUsers = [...this.userList];
  //     if (typeof window !== 'undefined' && window.localStorage) {
  //       localStorage.setItem('userList', JSON.stringify(this.userList));
  //     }
  //   });
  // }

//   ngOnInit() {
//   if (typeof window !== 'undefined' && window.localStorage) {
//     const storedUsers = localStorage.getItem('userList');
//     if (storedUsers) {
//       try {
//         const parsedUsers = JSON.parse(storedUsers);
//         if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
//           this.userList = parsedUsers;
//           this.filteredUsers = [...this.userList];
//           return;
//         }
//       } catch (e) {
//         console.error('Error parsing localStorage data', e);
//       }
//     }
//   }

//   // fallback to JSON file if nothing is in localStorage
//   this.http.get<any[]>('assets/user-list.json').subscribe((data) => {
//     this.userList = data;
//     this.filteredUsers = [...this.userList];
//     if (typeof window !== 'undefined' && window.localStorage) {
//       localStorage.setItem('userList', JSON.stringify(this.userList));
//     }
//   });
// }


ngOnInit() {
  const APP_VERSION = 'v1.0.0'; // 🔁 Update this on every deployment

  if (typeof window !== 'undefined' && window.localStorage) {
    const storedVersion = localStorage.getItem('appVersion');

    // If version changed, clear old data
    if (storedVersion !== APP_VERSION) {
      localStorage.removeItem('userList');
      localStorage.setItem('appVersion', APP_VERSION);
    }

    const storedUsers = localStorage.getItem('userList');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          this.userList = parsedUsers;
          this.filteredUsers = [...this.userList];
          return;
        }
      } catch (e) {
        console.error('Error parsing localStorage data', e);
      }
    }
  }

  // Fallback: fetch from assets if no data or version mismatch
  this.http.get<any[]>('assets/user-list.json').subscribe((data) => {
    this.userList = data;
    this.filteredUsers = [...this.userList];
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('userList', JSON.stringify(this.userList));
    }
  });
}

  onSearch() {
    const search = this.userId?.trim().toLowerCase() || '';
     console.log(this.userList,"userList");
    this.filteredUsers = search
      ? this.userList.filter(
          (user) =>
            String(user.EAN)?.toLowerCase().includes(search) ||
            user.Shelflife?.toLowerCase().includes(search) ||
            user.sku?.toLowerCase().includes(search) ||
            user.skucode?.toLowerCase().includes(search)
        )
      : [...this.userList];
  }

  onReset() {
    this.http.get<any[]>('assets/user-list.json').subscribe((data) => {
      this.userList = data;
      this.filteredUsers = [...this.userList];

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('userList', JSON.stringify(this.userList));
      }

      this.cdr.detectChanges();
    });
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
      data: { ...user }, // pass user data to dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
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
