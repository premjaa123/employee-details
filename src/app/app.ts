import { Component } from '@angular/core';
import { UserDetailsModule } from './user-details/user-details-module';

@Component({
  selector: 'app-root',
  imports:[UserDetailsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'userDetails';
}
