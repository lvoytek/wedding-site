import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material.module';
import { RsvpComponent } from './rsvp/rsvp.component';
import { InfoComponent } from './info/info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RsvpService } from './services/rsvp.service';
import { ApiService } from './services/api.service';
import { RsvpFormComponent } from './forms/rsvp/rsvp.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RsvpComponent,
    InfoComponent,
	RsvpFormComponent
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
	FormsModule,
	ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
	RsvpService,
	ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
