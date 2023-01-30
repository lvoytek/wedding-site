import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material.module';
import { RsvpComponent } from './rsvp/rsvp.component';
import { InfoComponent } from './info/info.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RsvpComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
	FormsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
