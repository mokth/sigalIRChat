import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConnectedUser } from '../model/connected-user';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-connected-users',
  templateUrl: './connected-users.component.html',
  styleUrls: ['./connected-users.component.css']
})
export class ConnectedUsersComponent implements OnInit {
 
  faUserCircle=faUserCircle;
  
  @Output() selectedUser = new EventEmitter();
  @Input() users:ConnectedUser[]=[];
  constructor() { }

  ngOnInit() {
   
  }
  
  onUserClick(user:ConnectedUser){
    console.log(user);
    user.unreadmsg=0;
    this.selectedUser.emit(user);
  }
}
