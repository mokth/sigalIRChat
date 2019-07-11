import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {
  
  @Input() message:string;
  @Input() msgtime:Date;
  @Input() who:string;
  @Input() userid:string;
  @Input() adminid:string;
  @Input() imageUrl:string;
  constructor() { }

  ngOnInit() {
    
  }

}
