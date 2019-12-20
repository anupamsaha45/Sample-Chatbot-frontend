import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	title = 'ContractTerminator';
	location: Location;
	ngOnInit() {
		// if (environment) {
		// 	if (location.protocol === 'http:') {
		// 		window.location.href = location.href.replace('http', 'https');
		// 	}
		// }    
	}
}