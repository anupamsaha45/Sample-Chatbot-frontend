import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { NgxPopperModule } from 'ngx-popper';

import { CookieService } from 'ngx-cookie-service';

import { HttpClientModule } from '@angular/common/http';

import {MyDatePickerModule} from 'mydatepicker';


@NgModule({

  declarations: [

    AppComponent,

  ],

  imports: [


    BrowserModule,

    AppRoutingModule,

    BrowserAnimationsModule,

    FormsModule,

    NgxPopperModule,

    HttpClientModule,

    MyDatePickerModule
 

  ],

  providers: [CookieService],

  bootstrap: [AppComponent]

})

export class AppModule { }