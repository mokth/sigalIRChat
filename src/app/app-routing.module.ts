import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserChatComponent } from './user-chat/user-chat.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { LoginComponent } from './login/login.component';
import { AuthguardService } from './services/AuthguardService';

const routes: Routes = [
  {
    path: '', component:UserChatComponent    
  },
  {
    path: 'admin',canActivate: [AuthguardService], component:AdminMainComponent     
  },
  {
    path: 'login', component:LoginComponent     
  },

 

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
