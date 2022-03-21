import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CdsButtonModule } from '@cds/angular/button';
import { CdsAlertModule } from '@cds/angular/alert';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CdsButtonModule,
    CdsAlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
