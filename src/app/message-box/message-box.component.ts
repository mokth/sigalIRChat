import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ViewImageComponent } from '../dialog/view-image/view-image.component';


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
  constructor( public dialog: MatDialog,) { }

  ngOnInit() {
    
  }
  
  onViewImage(imageUrl){
   
    const dialogRef = this.dialog.open(ViewImageComponent, {
      data: { name: imageUrl },
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
