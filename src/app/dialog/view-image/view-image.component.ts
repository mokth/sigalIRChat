import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.css']
})
export class ViewImageComponent implements OnInit {

  constructor(
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ViewImageComponent>
  ) { }

  ngOnInit() {
  }
  
  onNoClick(): void {
    this.dialogRef.close(0);
  }

  
}
