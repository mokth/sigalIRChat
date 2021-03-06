import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Subscription, BehaviorSubject, from } from 'rxjs';
import * as signalR from '@aspnet/signalr';
import * as groupArray from 'group-array'
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { faUserCircle, faCog, faPlay, faComments,
         faStreetView,faImage, faFilter, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { TimeAgoService } from '../services/time-ago.service';
import { Router } from '@angular/router';

import { ChatMessage } from '../model/chatmessage';
import { MessageAPI } from '../API/message-api';
import { ConnectedUser } from '../model/connected-user';
//import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SettingComponent } from '../dialog/setting/setting.component';
import { FilterComponent } from '../dialog/filter/filter.component';
import { LocationComponent } from '../dialog/location/location.component';
import { UserInfo } from '../model/model';
import { AuthService } from '../services/auth.service';
import { ChangeAdminComponent } from '../dialog/change-admin/change-admin.component';
import { ImageUploadComponent } from '../dialog/testup-image/image-upload.component';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent implements OnInit {
  galaAdminID: string;
  isConnected: boolean;
  isReadyToChat: boolean;
  messages: ChatMessage[] = [];
  grpmessages: any;
  groups: any = [];
  groupos: any = [];
  userlist: ConnectedUser[] = [];
  daySubscription: Subscription;
  unreadSubscription: Subscription;
  selectduser: ConnectedUser;
  currentselectduser: ConnectedUser;
  lastNdays: number;
  username: string;
  adminName: string;
  send2UserId: string;

  faStreetView = faStreetView
  faUserCircle = faUserCircle;
  faCog = faCog;
  faPlay = faPlay;
  faImage = faImage;
  faFilter = faFilter;
  faComment=faComments;
  faSignOutAlt = faSignOutAlt;
  textmsg = new FormControl();
  changeOwner: boolean;
  admin: UserInfo;
  private $day: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private hubConnection: signalR.HubConnection;

  @ViewChild(VirtualScrollerComponent, { static: true }) viewport: VirtualScrollerComponent;
  @ViewChild('accessId', { static: true }) accessId: ElementRef;

  constructor(private api: MessageAPI,
    private dateServ: TimeAgoService,
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog,
    @Inject('MSG_API') public msgUrl: string,
    @Inject('API_URL') public apiUrl: string) {
    const localdata = localStorage.getItem('_admin');
    if (localdata == null) {
      this.auth.logOut();
      this.router.navigate(['/login']);
    }
    this.admin = JSON.parse(localdata);
    let date = new Date();
    this.galaAdminID = this.admin.name
    this.adminName = this.admin.fullname;
    this.username = "";//this.admin.fullname;
    this.lastNdays = 3;
    this.selectduser = null;
  }

  ngOnInit() {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl)
      .build();
    this.onConnect();
    this.initHubConnection();
    this.hubConnection.onclose(() => {
      console.log("I am disconnetd");
      this.isConnected = false;
    });

  }

  ngOnDestroy(): void {
    if (this.daySubscription) {
      this.daySubscription.unsubscribe();
    }
  }

  initHubConnection() {
    this.hubConnection.on("ReceiveMessageEx", (user, type, servermessage, id) => {
      console.log("server :" + servermessage);
      let msg = new ChatMessage();
      msg.user = user;
      msg.type = type;
      if (type=="image"){
        msg.imageUrl = this.msgUrl+"images/"+servermessage;
      }else{
        msg.message = servermessage; 
      }     
      msg.id = id;
      msg.adminid = this.galaAdminID;
      msg.msgon = new Date();
      msg.mine = "yours";
      let found = this.userlist.find(x => x.id == id);
      if (found) {
        //if not currect user then update counter
        if (this.selectduser == null || this.selectduser.id != id) {
          found.unreadmsg = found.unreadmsg + 1;
        }
      }
      //if currect user msg only update
      if (this.selectduser && this.selectduser.id == id) {

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
        //   this.messages = [...this.messages, msg];
        // this.viewport.scrollToIndex(this.messages.length);
        this.viewport.scrollToIndex(this.messages.length);
        this.api.setMessagesAttended(this.selectduser.memberid)
          .subscribe(val => console.log(val));
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
        user.online = item.Online;
        user.attendedBy = item.attendedBy;
        this.userlist = [...this.userlist, user];
      });
      this.getUnreadMsgCount();
    });

    this.hubConnection.on("ConnectedUser", (id, userid, memberid, mobile, location, noofunreadmsg, active) => {
      console.log("ConnectedUser");
      if (active) { //connected
        let found = this.userlist.find(x => x.memberid == memberid);
        if (found == null) { // member no found
          let user = new ConnectedUser();
          user.id = id
          user.userid = userid;
          user.mobile = mobile;
          user.memberid = memberid;
          user.unreadmsg = noofunreadmsg;
          user.connectedOn = new Date();
          user.online = active;
          user.location = location;
          user.attendedBy = "";
          this.userlist = [...this.userlist, user];
        } else { //member found, update info
          found.id = id
          found.userid = userid;
          found.mobile = mobile;
          found.online = active;
          //found.attendedBy ="";
          found.unreadmsg = noofunreadmsg;
          found.connectedOn = new Date();
        }

      } else { //disconnected
        let found = this.userlist.find(x => x.id == id);
        if (found != null) {
          found.online = false;
        }
      }

    });

    this.hubConnection.on("SelectedUser", (id, adminid, status) => {
      console.log("SelectedUser " + id);
      let found = this.userlist.find(x => x.id == id);
      if (found != null) {
        found.attendedBy = adminid;
      }
    });
  }

  onConnect() {
    this.userlist = [];
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

  onTextKeydown(event) {
    if (event.key === "Enter") {
      this.onSendMsg();
    }
  }

  onSendMsg() {
    //console.log(this.selectduser);
    this.hubConnection
      .invoke("SendMessageToUser", this.selectduser.id, this.galaAdminID, this.textmsg.value,'message')
      .then((x) => {
        let msg = new ChatMessage();
        msg.user = this.send2UserId;//this.userid.value;
        msg.type = "Message";
        msg.mine = "mine";
        msg.msgon = new Date();
        msg.adminid = this.galaAdminID;
        msg.message = this.textmsg.value;
        // this.messages = [...this.messages, msg];
        this.textmsg.setValue("");
        //this.viewport.scrollTo({bottom: 0});
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
        // this.viewport.scrollToIndex(this.messages.length);
      })
      .catch(err => console.error(err.toString()));
  }

  OnUserSelected(user) {
    if (user == 1) {
      this.onConnect();
      return;
    }
    this.currentselectduser = user;
    console.log(user.attendedBy);
    if (user.attendedBy != null) {
      if (user.attendedBy != '') {
        if (!this.changeOwner){
          this.changeOwner=true;
          this.openChgOwnerDialog(user.attendedBy);
          return;
        }else return;
      }
    }
    this.setUserOwner();

    // if (this.selectduser != null) {
    //   //reset this user be unattended
    //   this.onAttendUser(this.selectduser.id, '', '');
    // }
    // this.isReadyToChat = false;
    // this.selectduser = user;
    // this.onAttendUser(this.selectduser.id, this.galaAdminID, 'attend');
    // this.username = this.selectduser.userid;
    // this.getUserLastMessages();
  }

  setUserOwner() {
    if (this.selectduser != null) {
      //reset this user be unattended
      this.onAttendUser(this.selectduser.id, '', '');
    }
    this.isReadyToChat = false;
    this.selectduser = this.currentselectduser;
    this.onAttendUser(this.selectduser.id, this.galaAdminID, 'attend');
    this.username = this.selectduser.userid;
    this.getUserLastMessages();
  }

  onAttendUser(id: string, adminid: string, status: string) {
    let found = this.userlist.find(x => x.id == id);
    if (found != null) {
      found.attendedBy = adminid;
    }
    this.hubConnection
      .invoke("AttendingUser", id, adminid, status)
      .catch(err => console.error(err.toString()));
  }

  getUserLastMessages() {
    this.daySubscription =
      this.api.getUserLastNDaysMessages(this.lastNdays, this.selectduser.memberid)
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
            chat.adminid = msg.adminid;
            chat.type = msg.msgtype;
            if (chat.type=="image"){
              chat.imageUrl = this.msgUrl+"images/"+msg.message;
            }else{
              chat.message = msg.message;
            }
           // chat.message = msg.message;
            chat.mine = (msg.frAdmin) ? "mine" : "yours";
            temp = [...temp, chat];

            // console.log(grp);
            // this.viewport.scrollToIndex(this.messages.length);
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

          this.viewport.scrollToIndex(this.messages.length);
          this.isReadyToChat = true;
        });
  }

  getUnreadMsgCount() {
    this.unreadSubscription =
      this.api.getUnreadMessagesCount(this.lastNdays)
        .subscribe(data => {
          console.log(data);
          data.forEach(item => {
            console.log(item.memberid + "  " + item.noofmsg);
            let found = this.userlist.find(x => x.memberid == item.memberid);
            if (found) {
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
      if (result > 0) {
        this.lastNdays = result;
        if (this.selectduser) {
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

  openChgOwnerDialog(name: string) {
    const dialogRef = this.dialog.open(ChangeAdminComponent, {
      data: {
        name: name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
     
      if (result == 1){
        this.setUserOwner();
      }
      this.changeOwner=false;
    });
  }

  logout() {
    this.onDisconnect();
    this.auth.logOut();
    this.router.navigate(['/login']);
  }

  
  openImageDialog(): void {
    const dialogRef = this.dialog.open(ImageUploadComponent, {
      data: { name: this.galaAdminID },
      height:"400"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('upload image ' + result);
      if (result) {
        let msg = new ChatMessage();
        msg.user = this.send2UserId;//this.userid.value;
        msg.type = "image";
        msg.mine = "mine";
        msg.msgon = new Date();
        msg.adminid = this.galaAdminID;
        msg.message = "";
        msg.imageUrl = this.msgUrl+"images/" + result;
        this.messages = [...this.messages, msg];
        this.hubConnection
        .invoke("SendMessageToUser", this.selectduser.id, this.galaAdminID, result,'image')
       
      }
    });
  }
}
