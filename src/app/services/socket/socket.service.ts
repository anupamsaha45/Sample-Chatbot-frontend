import { Injectable } from '@angular/core';
import { SettingService } from '../setting/setting.service';
import * as socketIo from 'socket.io-client';
import { Message } from '../../pages/shared/model/message';
import { Observable, Observer } from 'rxjs'
// import { Message } from '../../pages/shared/model/message';
import { Event } from '../../pages/shared/model/event';
import { TokenService } from '../token/token.service';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  private socket;
  private connected;

  // private Message = [];

  //  url for backend
  apiURL = {
    socketURL: `${this.settingService.apiURL}/?connection=1`,
  };

  constructor(
    private settingService: SettingService,
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.connected = 1
  }

  /**
   * @author Anupam
   * @desc  socket.io connection from client to server
   */

  // initizate connection from client to connect socket

  public initSocket(): void {
    
   this.socket = socketIo(this.apiURL.socketURL);
   this.socket.on('success', (data) => {
     console.log('Success')
     if (data.token) {
       this.tokenService.token = data.token;      
     }
     if(this.connected) {
       this.socket.emit('auth-success', 'Authentication Successful')
       this.connected = 0;
     }
   
   });

    this.socket.on('user connected', (data) => {          
        this.socket.emit('token', this.tokenService.token, this.connected)
    });
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      console.log("1111111111111")
      this.socket.on('bot-reply', (data: Message) => observer.next(data));
    });
  }

  public onChatLoad(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('loadChat', (data) => observer.next(data));
    });
  }

  public send(message): void {
    let data = {
      message: message.message,
      token: this.tokenService.token
    };
    this.socket.emit('chat-message', message);
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, (data: Message) => observer.next());
    });
  }


  // public onConfirm
}