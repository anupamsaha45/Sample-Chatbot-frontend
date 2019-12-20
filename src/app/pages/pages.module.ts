import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material';
import { ClickOutsideModule } from 'ng-click-outside';
import {MyDatePickerModule} from 'mydatepicker';


@NgModule({
  declarations: [
    ChatbotComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    MatMenuModule,
    ClickOutsideModule,
    MyDatePickerModule
  ]
})
export class PagesModule { }
