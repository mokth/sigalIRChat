import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Subscription, BehaviorSubject, from } from 'rxjs';
import * as signalR from '@aspnet/signalr';
import * as groupArray from 'group-array'
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { faUserCircle,faCog,faPlay,faStreetView,faFilter } from '@fortawesome/free-solid-svg-icons';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { ChatMessage } from '../model/chatmessage';
import { MessageAPI } from '../API/message-api';
import { ConnectedUser } from '../model/connected-user';
//import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { TimeAgoService } from '../services/time-ago.service';
import { SettingComponent } from '../dialog/setting/setting.component';
import { FilterComponent } from '../dialog/filter/filter.component';
import { LocationComponent } from '../dialog/location/location.component';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent implements OnInit {
  galaAdminID:string;
  isConnected:boolean;
  isReadyToChat:boolean;
  messages: ChatMessage[] = [];
  grpmessages:any;
  groups:any=[];
  groupos:any=[];
  userlist: ConnectedUser[] = [];
  daySubscription: Subscription;
  unreadSubscription: Subscription;
  selectduserid:ConnectedUser;
  lastNdays:number;
  username:string;
  send2UserId:string;

  faStreetView =faStreetView
  faUserCircle=faUserCircle;
  faCog =faCog;
  faPlay = faPlay;
  faFilter = faFilter;
  textmsg = new FormControl();
  
  private $day: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private hubConnection: signalR.HubConnection;

  @ViewChild(VirtualScrollerComponent, { static: true }) viewport: VirtualScrollerComponent;
  @ViewChild('accessId',{ static: true }) accessId: ElementRef;

  constructor(private api: MessageAPI,
              private dateServ:TimeAgoService,
              public dialog: MatDialog,
              @Inject('API_URL') public apiUrl: string) {
     let date= new Date();
     this.galaAdminID="GalaAdim";
     this.username ="";
     this.lastNdays =3;
     this.selectduserid= null;
     
  }

  ngOnInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl)
      .build();
    this.onConnect();
    this.initHubConnection();
    
  }

  ngOnDestroy(): void {
    this.daySubscription.unsubscribe();
  }

  initHubConnection() {
    this.hubConnection.on("ReceiveMessageEx", (user, type, servermessage, id) => {
      console.log("server :" + servermessage);
      let msg = new ChatMessage();
      msg.user = user;
      msg.type = type;
      msg.message = servermessage;
      msg.id = id;
      msg.mine = "yours";
      let found = this.userlist.find(x=>x.id==id);
      if (found ){
        //if not currect user then update counter
        if (this.selectduserid==null || this.selectduserid.id !=id){ 
          found.unreadmsg=found.unreadmsg+1;
        }
      }
      //if currect user msg only update
      if (this.selectduserid && this.selectduserid.id ==id){ 
          this.messages = [...this.messages, msg];
         // this.viewport.scrollToIndex(this.messages.length);
          this.viewport.scrollToIndex(this.messages.length);
          this.api.setMessagesAttended(this.selectduserid.memberid)
             .subscribe(val=>console.log(val));
      }
    });

    this.hubConnection.on("ReceiveUsers", (servermessage) => {
      console.log("ReceiveUsers ");
      var json = JSON.parse(servermessage);
      console.log(json);
      json.forEach(item => {
        let user = new ConnectedUser();
        user.id = item.Id;
        user.userid = item.UserId;
        user.connectedOn = item.ConnectedOn;
        user.memberid = item.MemberId;
        user.mobile = item.Mobile;
        user.location = item.Location;
        user.online= item.Online;
        this.userlist = [...this.userlist, user];
      });
      this.getUnreadMsgCount();
    });

    this.hubConnection.on("ConnectedUser", (id, userid,memberid,mobile,location,noofunreadmsg, active) => {
      console.log("ConnectedUser");
      if (active){ //connected
        let found = this.userlist.find(x=>x.memberid==memberid);
        if (found==null) { // member no found
          let user = new ConnectedUser();
          user.id = id
          user.userid = userid;
          user.mobile= mobile;
          user.memberid = memberid;
          user.unreadmsg =noofunreadmsg;
          user.connectedOn = new Date();
          user.online= active;
          user.location = location;
          this.userlist = [...this.userlist, user];
        }else{ //member found, update info
          found.id = id
          found.userid = userid;
          found.mobile= mobile;
          found.online= active;
          found.unreadmsg =noofunreadmsg;
          found.connectedOn = new Date();
        }

      }else{ //disconnected
        let found = this.userlist.find(x=>x.id==id);
        if (found!=null){
          found.online= false;
        }
      }    
     
    });
  }

  onConnect() {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.onRegister();
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  onDisconnect() {
    this.hubConnection.stop().then((x) => {
      console.log("Connection stop");
      this.isConnected = false;
    });
  }

  onRegister() {
    this.hubConnection
      .invoke("RegisterAdmin", this.galaAdminID)
      .then(x => {
        console.log('registered as ' + this.galaAdminID);
        this.isConnected = true;
        this.onSendLogonUsers();
      })
      .catch(err => console.error(err.toString()));
  }

  onSendLogonUsers() {
    this.hubConnection
      .invoke("SendLogonUsers")
      .catch(err => console.error(err.toString()));
  }

  onTextKeydown(event){
    if (event.key === "Enter") {
      this.onSendMsg();
    }
  }
  
  onSendMsg() {
    //console.log(this.selectduserid);
    this.hubConnection
      .invoke("SendMessageToUser", this.selectduserid.id, "test", this.textmsg.value)
      .then((x)=>{
        let msg = new ChatMessage();
        msg.user = this.send2UserId;//this.userid.value;
        msg.type = "Message";
        msg.mine= "mine";
        msg.message = this.textmsg.value;
        this.messages = [...this.messages, msg];
        this.textmsg.setValue("");
        //this.viewport.scrollTo({bottom: 0});
        this.accessId.nativeElement.focus();
        this.viewport.scrollToIndex(this.messages.length);
       // this.viewport.scrollToIndex(this.messages.length);
      })
      .catch(err => console.error(err.toString()));
  }
  
  OnUserSelected(user){
    this.isReadyToChat=false;
    console.log(user);
    this.selectduserid =user;
    this.username = this.selectduserid.userid;
    this.getUserLastMessages();
  }

  getUserLastMessages(){
    this.daySubscription = 
      this.api.getUserLastNDaysMessages(this.lastNdays,this.selectduserid.memberid)
         .subscribe(msgs => {
          this.messages=[];
          let temp=[];
          msgs.forEach(msg => {
            let chat = new ChatMessage();
            chat.id = msg.id;
            chat.user = msg.userid;
            let date:Date = new Date(msg.msgon);
            chat.datestr =date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
            chat.msgon = date;
            chat.message = msg.message;
            chat.mine = (msg.frAdmin) ? "mine" : "yours";
            temp = [...temp, chat];
          
           // console.log(grp);
           // this.viewport.scrollToIndex(this.messages.length);
          });
         
          this.grpmessages= groupArray(temp,'datestr');
          for (var commonBrand in this.grpmessages){
              console.log(commonBrand)
              let chat = new ChatMessage();
                chat.id = "1";
                chat.user = "1";
                let date:Date = new Date();
                chat.datestr = commonBrand;
                chat.msgon = date;
                chat.message = this.dateServ.timeAgo(this.grpmessages[commonBrand][0].msgon);
                chat.mine = "date";
                this.messages = [...this.messages, chat];
                for(var i = 0; i < this.grpmessages[commonBrand].length; i++){
                  this.messages = [...this.messages, this.grpmessages[commonBrand][i]];  
                }
          }
          
          this.viewport.scrollToIndex(this.messages.length);
          this.isReadyToChat=true;
        });
   }

   getUnreadMsgCount(){
    this.unreadSubscription= 
       this.api.getUnreadMessagesCount()
          .subscribe(data=>{
             console.log(data); 
             data.forEach(item => {
                console.log(item.memberid+"  "+item.noofmsg);
                let found= this.userlist.find(x=>x.memberid==item.memberid);
                if (found){
                   found.unreadmsg = item.noofmsg;
                }
             });
          });
   }
   
   openDialog(): void {
    const dialogRef = this.dialog.open(SettingComponent, {
      // width: '50vw',     
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed '+result);
      if (result>0){
        this.lastNdays = result;
        if (this.selectduserid){
           this.getUserLastMessages();
        }
      }
    });
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterComponent, {
      // width: '50vw',     
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed '+result);
     
    });
  }

  openChgLocationDialog(): void {
    const dialogRef = this.dialog.open(LocationComponent, {
      // width: '50vw',     
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed '+result);
     
    });
  }
   
}
