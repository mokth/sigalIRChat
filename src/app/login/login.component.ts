import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogon: boolean;
  isEnable: boolean = false;
  message: string;
  rform: FormGroup;
  isWaiting:boolean;
  constructor(private auth: AuthService,
              private router: Router
             ) {
              
   }

  ngOnInit() {
    this.isWaiting =false;
    this.rform = new FormGroup({
      name: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
      //remember: new FormControl(null)
    });

   

    this.isLogon = this.auth.isAuthenticated();
    if (this.isLogon) {
      this.router.navigate(['/admin']);
      this.isWaiting =false;
    }
    this.auth.authChanged.subscribe(
      (x) => {
        this.isLogon = x;
        this.isEnable = false;
        if (this.isLogon) {
          this.router.navigate(['admin']);
          this.isWaiting =false;
        }
      }
    );
    this.auth.authMsgChanged.subscribe(
      (x) => {
        this.message = x;
        this.isWaiting =false;
      }
    );
  }

  onSignin(form: FormGroup) {
    this.message = "";
    this.isWaiting =true;
    this.isEnable = true;
    const name = this.rform.get('name').value;
    const password = this.rform.get('password').value;
    //const remember = this.rform.get('remember').value;
    this.auth.logIn(name, password);
   
  }
}
