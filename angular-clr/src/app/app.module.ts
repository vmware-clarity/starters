import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { ClarityModule } from '@clr/angular';
import { CdsButtonModule } from '@cds/angular/button';
import { CdsCardModule } from '@cds/angular/card';
import { CdsAlertModule } from '@cds/angular/alert';
import { CdsFormsModule } from '@cds/angular/forms';
import { CdsInputModule } from '@cds/angular/input';
import { CdsToggleModule } from '@cds/angular/toggle';
import { CdsDividerModule } from '@cds/angular/divider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ClarityModule,
    CdsButtonModule,
    CdsCardModule,
    CdsAlertModule,
    CdsFormsModule,
    CdsInputModule,
    CdsToggleModule,
    CdsDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
