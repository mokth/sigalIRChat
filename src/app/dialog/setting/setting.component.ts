import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  
  selectedValue:number;
  constructor(
    public dialogRef: MatDialogRef<SettingComponent>
  ) { }

  ngOnInit(): void {

  }

  onLastDayChanged(e){
     console.log(e.value); 
     this.selectedValue =e.value;
  }

  onNoClick(): void {
    this.dialogRef.close(0);
  }
  
}
