import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  // based on environment api changes
apiURL = environment.apiURL;
  constructor() { }
}
