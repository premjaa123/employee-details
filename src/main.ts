import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const APP_VERSION = 'v1.0.0'; // Change this on each new deployment

// Version check to force fresh fetch from user-list.json
const storedVersion = localStorage.getItem('appVersion');
if (storedVersion !== APP_VERSION) {
  localStorage.removeItem('userList');      // Clear old cached data
  localStorage.setItem('appVersion', APP_VERSION); // Store new version
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
