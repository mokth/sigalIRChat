import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  isAdmin:boolean;
  admin = new FormControl(false);

  ngOnInit(): void {
    this.isAdmin=false;
  }
  

  onChange(){
    this.isAdmin = this.admin.value;
  }
}
