import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';

import { SocketService } from '../../services/socket/socket.service';

import { CompanyService } from '../../services/company/company.service';

import {TemplateService} from '../../services/shared-template/template.service';

import { Action } from '../shared/model/action';

import { Event } from '../shared/model/event';

import { Observable, Observer } from 'rxjs';

import  {IMyDpOptions} from 'mydatepicker';



@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})

export class ChatbotComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  // Message input
  public messageText = <any>'';
   _albums= <any>[];
  // List of messages
  action = Action;
  messages = <any>[];
  messageContent: string;
  ioConnection: any;

  online;
  scrollIt = true
  menuFlag = false;
  quickOptionContentIndex = 1;
  loader = true;
  inputPlaceholder="Type a message"

  companies = <any>[]
  filterCompanies = <any>[]
  companyName = ''
  messageInput = true;
  todayDate = new Date(Date());
  userDate;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
    editableDateField:false,
    disableUntil:{year:this.todayDate.getFullYear() ,month: (this.todayDate.getMonth()+1), day:this.todayDate.getDate()}
  }
  
  public myDatePickerOption: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
    editableDateField:false,
    disableSince: {year: this.todayDate.getFullYear(), month: this.todayDate.getMonth() + 1, day: this.todayDate.getDate() + 1}
  }


  constructor(private companyService: CompanyService, private socketService: SocketService, private templateService: TemplateService) {}

  ngOnInit() {
    this.socketService.initSocket();
    this.initIoConnection();
    

  }

  stopScroll() {
      setTimeout(() => {
        this.scrollIt = false
      }, 2000);
    }

    changePlaceholderText(message) {
      console.log("message in changePlaceHoler", message.quick_replies)
      if(message.text && message.quick_replies)
        if(message.quick_replies.length>0)
          this.inputPlaceholder="Select an option above ⬆️"
        else
          this.inputPlaceholder="Type your message"


      else if(message.plugin == "datepicker")
      this.inputPlaceholder="Select your date above ⬆️"
    
      else if(message.plugin == "autofill")
        this.inputPlaceholder="Type your contract above ⬆"
      
      else if(message.quick_replies || message.plugin == "dropdown") 
        this.inputPlaceholder="Select an option above ⬆️"

      else
      this.inputPlaceholder="Type your message"
      
      
    }


  // Socket IO connection
  private async initIoConnection() {  
    
    this.socketService.onChatLoad().subscribe(res => {
      this.loader = false; 
      this.messages = res
      console.log('Chat History', this.messages)
      this.changePlaceholderText(this.messages[this.messages.length-1].message)
      
      var length = this.messages.length - 1
        if ((this.messages[length].message.quick_replies && this.messages[length].message.quick_replies.length>0) || this.messages[length].message.plugin == 'dropdown'
         || this.messages[length].message.plugin == 'autofill' || this.messages[length].message.plugin == 'datepicker') {
          this.messageInput = true;
        
        } else {
          this.messageInput = false;
        }

      this.stopScroll();
      })
    
    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: any) => {
        this.changePlaceholderText(message)
        this.loader = false;
        this.scrollIt = true;
     
        const data = {
          'from': 'bot',
          'message': message
        };

        this.messages.push(data);

        console.log("Messages", this.messages)

        var length = this.messages.length - 1
        if (this.messages[length].message.quick_replies || this.messages[length].message.plugin == 'dropdown'
         || this.messages[length].message.plugin == 'autofill' || this.messages[length].message.plugin == 'datepicker') {
          this.messageInput = true;
        
        } else {
          this.messageInput = false;
        }

        // if(this.messages.length>=2)
        //   if(this.messages[this.messages.length-2].from=='bot' && this.messages.length>=4)
        //     if(this.messages[this.messages.length-2].message.quick_replies) 
        //       this.messages[this.messages.length-2].message.quick_replies = []

        this.stopScroll();

        
      });

    /* socket connection event */
    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
        this.online = 1
      });

    /* socket Disconnection event */
    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
        this.online = 0
      });

      this.companies = await this.companyService.getCompanies()
      console.log("Companies", this.companies)
  }

  /* sending messages to the socket backend */
  public sendMessage(): void {
    this.scrollIt = true
    const  data = this.templateService.textTemplate(this.messageText);
    if ((data.message.text) !== '') {
      this.messages.push(data);
      this.stopScroll();
      this.messageText = this.companyName = '';
      this.filterCompanies = []

      this.socketService.send({
        message: data.message
      });
      this.messageContent = null;
      
      if(this.messages[this.messages.length-2].message.quick_replies)
        this.messages[this.messages.length-2].message.quick_replies.splice(0, this.messages[this.messages.length-2].message.quick_replies.length)
           
    }
    return;
  }


  // QuickReply Action
  async quickReply(quick_replyMsg, message) {
   this.scrollIt = true
   //quick_replyMsg.title = quick_replyMsg.title.substring(2, quick_replyMsg.title.length)

   //console.log("quick_reply title1", quick_replyMsg.title)

   const  data = this.templateService.quickReplyTemplate(quick_replyMsg)
    if (data.message.quick_replies) {
      await this.messages.push(data);
      this.stopScroll();
      this.socketService.send({
        message: data.message
      }); 
      var index = this.messages.indexOf(message);
      this.messages[index].message.quick_replies.splice(0, this.messages[index].message.quick_replies.length)
    }
  }

  // persistent menu
  async buttonMenu(text, button, message) {

    if(this.messages[this.messages.length-1].message.quick_replies) {
      let index = this.messages.length-1
      this.messages[index].message.quick_replies.splice(0, this.messages[index].message.quick_replies.length)
    }


    this.scrollIt = true
    const data = this.templateService.buttonTemplate(text, button);
    if (data.message.attachment.payload.buttons) {
      await this.messages.push(data);
      this.stopScroll();
      this.socketService.send({
        message: data.message
      });
    }
  }

  async filterCompany() {
    if(this.companyName == '') {
      this.filterCompanies = []
      return
    }

    this.filterCompanies = this.companies.filter((company) => {
      if(company.name.toLowerCase().includes(this.companyName.toLowerCase()))
        return company
    })
  }

  public fillCompanyBox(companyName) {
    if(companyName == '')
      return

    this.messageText = companyName;
    var index = this.messages.length - 1;
    this.messages.splice(index, 1);
    this.sendMessage()

  }

  async menuBtn1(title, payload) {
   this.scrollIt = true
   const data = this.templateService.menuButtonTemplate(title, payload)
   if (data.message.attachment.payload.buttons) {
     await this.messages.push(data);
     this.stopScroll();
     this.socketService.send({
       message: data.message
     });
   }
 }

  onDateChange(event){
    let date = event.formatted.split('.').join('-');
    this.messageText = date  ;
  }

  // close outside nav bar
  closeOutsideSidenav(){
    this.menuFlag = false;
  }

  // toggle nav bar
  openOutsideSidenav(){
    this.menuFlag = true;
  }

  // scroll feature
  ngAfterViewChecked() {
    if(this.scrollIt)
      this.scroll();
  }

  // Auto scroll feature
  scroll(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTo(
        { left: 0, top: this.myScrollContainer.nativeElement.scrollHeight, behavior: 'smooth' });
    } catch (err) { }
  }

  nextMenu(){
    this.quickOptionContentIndex = this.quickOptionContentIndex + 1;
    setTimeout(() => { this.menuFlag = true;}, 5);
  }

  prevMenu(){
    this.quickOptionContentIndex = this.quickOptionContentIndex - 1
    setTimeout(() => { this.menuFlag = true;}, 5);
  }

  




}