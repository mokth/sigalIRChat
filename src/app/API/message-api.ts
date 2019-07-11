import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MessageAPI {

  constructor(private http: HttpClient,

    @Inject('MSG_API') private apiUrl: string) { }

  getTodayMessages(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'api/chat/messages');
  }

  getUserLastNDaysMessages(days: number, memberid: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'api/chat/messages/' + days + '/' + memberid);
  }

  getMemberLastNDaysMessages(days: number, memberid: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'api/chat/mymessages/' + days + '/' + memberid);
  }

  getUnreadMessagesCount(days: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'api/chat/unread/'+ days);
  }

  setMessagesAttended(memberid: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'api/chat/attended/' + memberid);
  }
}