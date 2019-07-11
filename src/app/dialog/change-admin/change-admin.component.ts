import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-change-admin',
  templateUrl: './change-admin.component.html',
  styleUrls: ['./change-admin.component.css']
})
export class ChangeAdminComponent implements OnInit {
  selectedValue:number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangeAdminComponent>
  ) { }

  ngOnInit(): void {

  }

  
  onNoClick(): void {
    this.selectedValue=0;
    this.dialogRef.close(0);
  }
  

}
