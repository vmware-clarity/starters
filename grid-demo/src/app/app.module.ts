import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { loadCoreIconSet, loadEssentialIconSet } from '@cds/core/icon';

loadCoreIconSet();
loadEssentialIconSet();

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, BrowserModule, ClarityModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
