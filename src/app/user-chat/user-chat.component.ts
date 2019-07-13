import { Component, OnInit, ViewChild, AfterViewInit, Inject, ElementRef } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { TimeAgoService } from '../services/time-ago.service';
import * as groupArray from 'group-array'
import * as moment from 'moment';

import { FormControl } from '@angular/forms';
import { faPlay, faTimesCircle, faComments, faIdBadge,faImage } from '@fortawesome/free-solid-svg-icons';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { DeviceDetectorService } from 'ngx-device-detector';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';

import { ChatMessage } from '../model/chatmessage';
import { Subscription } from 'rxjs';
import { MessageAPI } from '../API/message-api';
import { MatDialog } from '@angular/material';
import { ImageUploadComponent } from '../dialog/testup-image/image-upload.component';


@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css']
})
export class UserChatComponent implements OnInit {
  isConnected: boolean;
  messages: ChatMessage[] = [];
  userid = new FormControl('User');
  memberid = new FormControl('1001');
  mobile = new FormControl('012-7723245');
  location = new FormControl('Skudai');
  textmsg = new FormControl();

  faPlay = faPlay;
  faTimesCircle = faTimesCircle;
  faComments = faComments;
  faIdBadge = faIdBadge;
  faImage = faImage;

  isSmallScreen: boolean = false;
  hidePanelMessage: boolean = false;
  showUserInfo: boolean = true;
  private hubConnection: signalR.HubConnection;
  deviceInfo = null;
  grpmessages: any;
  daySubscription: Subscription;

  @ViewChild(VirtualScrollerComponent, { static: false }) private viewport: VirtualScrollerComponent;
  @ViewChild('accessId', { static: false }) private accessId: ElementRef;

  constructor(
    private api: MessageAPI,
    private dateServ: TimeAgoService,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private deviceService: DeviceDetectorService,
    @Inject('MSG_API') public msgUrl: string,
    @Inject('API_URL') public apiUrl: string, ) {

    this.epicFunction();

  }

  ngOnInit() {

    this.isConnected = false;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl)
      .build();
  }

  epicFunction() {
    console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if (isMobile) {
      this.isSmallScreen = true;
      this.hidePanelMessage = !this.isConnected;
      this.showUserInfo = !this.isConnected;

    } else {
      this.isSmallScreen = false;
      this.hidePanelMessage = false;
      this.showUserInfo = true;
    }
  }


  onConnect() {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.onRegister(this.viewport);
      })
      .catch(err => console.log('Error while starting connection: ' + err))

    this.hubConnection.on("ReceiveMessage", (user, adminid, servermessage,type) => {
      console.log("server :" + servermessage);
      let msg = new ChatMessage();
      msg.user = user;
      msg.type =  type;
      msg.adminid = adminid;   
      msg.mine = "yours";
      msg.msgon = new Date();
      if (type=="image"){
        msg.imageUrl = this.msgUrl+"images/"+servermessage;
      }else {
         msg.message = servermessage;
      }
      if (this.messages.length > 0 &&
        this.messages[this.messages.length - 1].mine == "yours") {
        var lastmsg = this.messages[this.messages.length - 1];
        const d1 = moment(lastmsg.msgon);
        const d2 = moment(msg.msgon);
        const diff = d2.diff(d1, "minutes");
        if (diff > 5) {
          this.messages = [...this.messages, msg];
        } else {
          msg.message = lastmsg.message + '\n' + servermessage;
          this.messages.pop();
          this.messages = [...this.messages, msg];
        }
      } else {
        this.messages = [...this.messages, msg];
      }
      this.viewport.scrollToIndex(this.messages.length);
    });
  }

  onDisconnect() {
    this.hubConnection.stop().then((x) => {
      console.log("Connection stop");
      this.isConnected = false;
      if (this.isSmallScreen) {
        this.hidePanelMessage = true;
        this.showUserInfo = true;
      }
    });

  }
  onRegister(viewport: any) {
    this.hubConnection
      .invoke("Register",
        this.userid.value,
        this.memberid.value,
        this.mobile.value,
        this.location.value)
      .then(x => {
        console.log('registered as ' + this.userid.value);
        this.isConnected = true;
        if (this.isSmallScreen) {
          this.hidePanelMessage = false;
          this.showUserInfo = false;
        }
        this.getUserLastMessages(viewport);
      })
      .catch(err => console.error(err.toString()));
  }

  onTextKeydown(event) {
    if (event.key === "Enter") {
      this.onSendMsg();
    }
  }

  onSendMsg() {
    this.hubConnection
      .invoke("SendMessage2Admin", this.userid.value, "test", this.textmsg.value)
      .then((x) => {
        let msg = new ChatMessage();
        msg.user = this.userid.value;
        msg.type = "Message";
        msg.message = this.textmsg.value;
        msg.mine = "mine";
        msg.msgon = new Date();
        //this.messages = [...this.messages, msg];
        this.textmsg.setValue("");
        this.accessId.nativeElement.focus();
        if (this.messages.length > 0 &&
          this.messages[this.messages.length - 1].mine == "mine") {
          var lastmsg = this.messages[this.messages.length - 1];
          const d1 = moment(lastmsg.msgon);
          const d2 = moment(msg.msgon);
          const diff = d2.diff(d1, "minutes");
          if (diff > 5) {
            this.messages = [...this.messages, msg];
          } else {
            let comMsg = lastmsg.message + '\n' + msg.message;
            msg.message = comMsg;
            this.messages.pop();
            this.messages = [...this.messages, msg];
          }
        } else {
          this.messages = [...this.messages, msg];
        }
        this.viewport.scrollToIndex(this.messages.length);

      })
      .catch(err => console.error(err.toString()));
  }

  getUserLastMessages(viewport: any) {
    this.daySubscription =
      this.api.getMemberLastNDaysMessages(1, this.memberid.value)
        .subscribe(msgs => {
          this.messages = [];
          let temp = [];
          msgs.forEach(msg => {
            let chat = new ChatMessage();
            chat.id = msg.id;
            chat.user = msg.userid;
            let date: Date = new Date(msg.msgon);
            chat.datestr = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            chat.msgon = date;
            chat.type = msg.msgtype;
            chat.adminid = msg.adminid;
            if (msg.msgtype=="image"){
              chat.imageUrl =  this.msgUrl+"images/"+msg.message;
            }else {
               chat.message = msg.message;
            }
            chat.mine = (msg.frAdmin) ? "yours" : "mine";
            temp = [...temp, chat];
            this.viewport.scrollToIndex(this.messages.length);
          });

          this.grpmessages = groupArray(temp, 'datestr');
          for (var commonBrand in this.grpmessages) {
            console.log(commonBrand)
            let chat = new ChatMessage();
            chat.id = "1";
            chat.user = "1";
            let date: Date = new Date();
            chat.datestr = commonBrand;
            chat.msgon = date;
            chat.message = this.dateServ.timeAgo(this.grpmessages[commonBrand][0].msgon);
            chat.mine = "date";
            this.messages = [...this.messages, chat];
            for (var i = 0; i < this.grpmessages[commonBrand].length; i++) {
              this.messages = [...this.messages, this.grpmessages[commonBrand][i]];
            }
          }
          viewport.scrollToIndex(this.messages.length);
          //this.isReadyToChat=true;
        });
  }


  openImageDialog(): void {
    const dialogRef = this.dialog.open(ImageUploadComponent, {
      data: { name: this.userid.value },
      height:"400"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('upload image ' + result);
      if (result) {
        let msg = new ChatMessage();
        msg.user = this.userid.value;
        msg.type = "image";
        msg.message = "";
        msg.mine = "mine";
        msg.imageUrl = this.msgUrl+"images/" + result;
        msg.msgon = new Date();
        this.messages = [...this.messages, msg];
        
        this.hubConnection
        .invoke("SendMessage2Admin", this.userid.value, "image", result);
        
      }
    });
  }
}
