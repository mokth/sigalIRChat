import { Observable ,  Subject } from 'rxjs';

import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { UserInfo } from '../model/model';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable()
export class AuthService {
  authChanged = new Subject<boolean>();
  authMsgChanged = new Subject<string>();
  titleChanged = new Subject<string>();
  isvalidUser:boolean=false;
  jwtHelper: JwtHelperService = new JwtHelperService();
  userId:string;
  user:UserInfo= new UserInfo();
  changeMsgChanged = new Subject<string>();

  isAdminUser:boolean;

  constructor(private http:HttpClient,
              private router: Router,          
              @Inject('MSG_API') private apiUrl:string) { }
 
  logIn(name: string, password: string) {
     let user = new UserInfo();
     user.fullname='';
     user.name = name;
     user.password= password;
      //let body = JSON.stringify({	"name":name,"password":password,"fullname":''});
      let body = JSON.stringify(user);
      const headers = new HttpHeaders()
      .set('Content-Type', "application/json")
    
      console.log('posting login'+this.apiUrl+'api/auth/jwt1');
      this.http.post(this.apiUrl+'api/auth/jwt1',
                    body,{ headers: headers })
        .subscribe(
        (resp:any)=>{
         // let resp = data.json();
          console.log(resp); 
         if (resp.ok=="no"){
            this.authMsgChanged.next('Error '+resp.error);
            this.authChanged.next(false);
            return;
         }
        //  if (resp.chgpass==="chgpass"){
        //       this.router.navigate(['/auth/change']);
        //       return;
        //  }
          let token =JSON.parse(resp.data);
          //console.log(token);
          try{
                //this.jwtHelper.isTokenExpired(token.auth_token);
                this.userId=name;      
                user.name= name;
                user.fullname= resp.name;
                user.password="";
                localStorage.setItem('_token',token.auth_token);
                localStorage.setItem('_admin',JSON.stringify(user));
                this.isvalidUser =true;
                this.authChanged.next(true);
                this.storeUserInfo(token.auth_token);
               // this.subsev.subscribeToNotifications(this.getAuthToken()); 
                console.log("success login");
          }catch(e)
          {
            console.log(e);
            this.authMsgChanged.next('Error '+e);
            this.authChanged.next(false);
          }
        },
        (err)=>{
          console.log(err)
          this.authMsgChanged.next('Error '+err);
          this.authChanged.next(false);
        },
        ()=>{
          console.log('Complete post login')
        }
      )
  }
   
 
  afterChangePass(userid:string,token:any){
    this.userId=name;               
    localStorage.setItem('_token',token.auth_token);
    this.isvalidUser =true;
    this.authChanged.next(true);
    this.storeUserInfo(token.auth_token);
  }

  storeUserInfo(jwttoken:string){
    let token= this.jwtHelper.decodeToken(jwttoken);
    this.user.name= token.id;
    this.user.fullname= token.name;
    
    console.log(this.user);   
  }

  getUserInfo():UserInfo{
    let jwttoken= localStorage.getItem('_token');
    this.storeUserInfo(jwttoken);
    return this.user;
  }

  logOut() {
    this.isvalidUser =false;
     this.authChanged.next(false);
     localStorage.removeItem('_token');
  }

   isAuthenticated() {
    let token= localStorage.getItem('_token');
    let isvalid:boolean=false;
    if (token!=null){
        try{
          isvalid =!this.jwtHelper.isTokenExpired(token);
        }catch(e)
        {
        //  console.log('invalid token');
          
        }
    }
   // console.log('isvalid'+isvalid);
    return isvalid;
  }
  
  isGalaAdmin(){
    return this.isAdminUser;
  }
  getAuthToken(){
    let authToken="";
    let token= localStorage.getItem('_token');
    let isvalid:boolean=false;
    if (token!=null){
        try{
         // authToken= this.jwtHelper.decodeToken(token);
          authToken = token;
        }catch(e)
        {
          console.log('invalid token');
          
        }
    }
    return "Bearer "+ authToken;
  }
  
  requestAccess(screenid: string) {
    let body = JSON.stringify({	"name":this.getUserID(),"password":'nill',"fullname":screenid});
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getAuthToken());
    return this.http.post(this.apiUrl+'api/auth/access',
                   body,{ headers: headers });
  }

  getUserID(){
    this.userId ="";
    let token= localStorage.getItem('_token');
    let isvalid:boolean=false;
    if (token!=null){
        try{
          var decode= this.jwtHelper.decodeToken(token);
          this.userId = decode.aud;
        }catch(e)
        {
          console.log('invalid token');
          
        }
    }
    return this.userId;
  }

  changePassword(user:UserInfo):Observable<any> {
    let body = JSON.stringify(user);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.apiUrl+'api/auth/change',
                  body,{ headers: headers });
 }

 resetPassword(userid:string):Observable<any> {
  let headers = new HttpHeaders();
  headers.append('Content-Type', 'application/json');
  return this.http.get(this.apiUrl+'api/auth/reset/'+userid,
                { headers: headers });
}

}
