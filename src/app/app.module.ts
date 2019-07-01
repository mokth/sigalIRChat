///Angular core
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

///Angular Tool
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { NgPipesModule } from 'ngx-pipes';

//Angular Material
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogRef } from '@angular/material/dialog';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MydirectiveDirective } from './directive/mydirective.directive';
import { UserChatComponent } from './user-chat/user-chat.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { environment } from 'src/environments/environment';
import { ConnectedUsersComponent } from './connected-users/connected-users.component';
import { MessageAPI } from './API/message-api';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { SettingComponent } from './dialog/setting/setting.component';
import { FilterComponent } from './dialog/filter/filter.component';
import { LocationComponent } from './dialog/location/location.component';



@NgModule({
  declarations: [
    AppComponent,
    MydirectiveDirective,
    UserChatComponent,
    MessageBoxComponent,
    ConnectedUsersComponent,
    AdminMainComponent,
    SettingComponent,
    FilterComponent,
    LocationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSliderModule,
    MatIconModule,
    MatToolbarModule,
    ScrollDispatchModule,
    MatInputModule,
    MatDialogModule,
    FontAwesomeModule,
    FlexLayoutModule,
    VirtualScrollerModule,
    NgPipesModule,
    DeviceDetectorModule.forRoot()
  ],
  entryComponents:[
    SettingComponent,
    FilterComponent,
    LocationComponent
  ],
  providers: [
    MessageAPI,
    { provide: 'API_URL', useValue: `${environment.apiUrl}` },
    { provide: 'MSG_API', useValue: `${environment.msgApi}` },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: MatDialogRef, useValue: {}}
  ],
  bootstrap: [AppComponent]


})
export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule);
