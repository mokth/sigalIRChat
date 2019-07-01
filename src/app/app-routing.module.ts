import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserChatComponent } from './user-chat/user-chat.component';
import { AdminMainComponent } from './admin-main/admin-main.component';

const routes: Routes = [
  {
    path: '', component:UserChatComponent    
  },
  {
    path: 'admin', component:AdminMainComponent     
  },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
