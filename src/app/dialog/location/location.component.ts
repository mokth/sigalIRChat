import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  
  locations = [
    {value: 'Skudai', viewValue: 'Skudai'},
    {value: 'Johor Bahru', viewValue: 'Johor Bahru'},
    {value: 'Tampoi', viewValue: 'Tampoi'},
    {value: 'Johor Jaya', viewValue: 'Johor Jaya'},
    {value: 'Tebrau', viewValue: 'Tebrau'},
    {value: 'Mount Austin', viewValue: 'Mount Austin'}
  ];

  selectedValue:String;
  constructor(
    public dialogRef: MatDialogRef<LocationComponent>
  ) { }

  ngOnInit(): void {

  }

  onLocationChanged(e){
     console.log(e); 
     this.selectedValue =e.value;
  }

  onNoClick(): void {
    this.dialogRef.close(0);
  }

}
