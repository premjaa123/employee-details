import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.css'],
  standalone: false,
})
export class UserDetails implements OnInit {
  userId: string = '';
  userList: any[] = [];
  filteredUsers: any[] = [];
  searchPerformed: boolean = false;

  expiryDates: Date[] = [];
  removalDates: { [key: number]: string } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('assets/user-list.json').subscribe((data) => {
      this.userList = data;
      this.filteredUsers = [];
    });
  }

  onSearch() {
    const search = this.userId?.trim().toLowerCase() || '';
    this.searchPerformed = true;

    if (!search) {
      this.filteredUsers = [];
      return;
    }

    this.filteredUsers = this.userList.filter((user) =>
      [user.EAN, user.Shelflife, user.sku, user.skucode]
        .map((field) => String(field).toLowerCase())
        .some((val) => val.includes(search))
    );

    this.expiryDates = [];
    this.removalDates = {};
  }

  checkSuggestion(index: number, user: any) {
    const selectedDate = this.expiryDates[index];

    if (!selectedDate || !user.Shelflife) {
      this.removalDates[index] = '❌ Please select a valid expiry date';
      return;
    }

    const expiry = new Date(selectedDate);
    const shelfDays = parseInt(user.Shelflife, 10);

    if (isNaN(shelfDays)) {
      this.removalDates[index] = '❌ Invalid shelf life';
      return;
    }

    const removalDate = new Date(expiry);
    removalDate.setDate(removalDate.getDate() - shelfDays);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    removalDate.setHours(0, 0, 0, 0);

    if (removalDate < today) {
      this.removalDates[index] = '❌ Expired already';
    } else {
      const dayName = removalDate.toLocaleDateString('en-GB', {
        weekday: 'short',
      });
      const dateStr = removalDate.toLocaleDateString('en-GB');

      this.removalDates[index] = `✅ To be removed on: ${dayName}, ${dateStr}`;
    }
  }
}
