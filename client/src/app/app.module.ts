import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from './material.module';
import { RsvpComponent } from './components/rsvp/rsvp.component';
import { InfoComponent } from './components/info/info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RsvpService } from './services/rsvp.service';
import { GuestService } from './services/guest.service';
import { ApiService } from './services/api.service';
import { RsvpFormComponent } from './components/forms/rsvp/rsvp.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddGuestComponent } from './components/forms/add-guest/add-guest.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RsvpComponent,
    InfoComponent,
	RsvpFormComponent,
	AdminComponent,
	AddGuestComponent
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
	FormsModule,
	ReactiveFormsModule,
    MaterialModule,
	SocialLoginModule
  ],
  providers: [
	RsvpService,
	GuestService,
	ApiService,
	{
		provide: 'SocialAuthServiceConfig',
		useValue: {
		  autoLogin: false,
		  providers: [
			{
			  id: GoogleLoginProvider.PROVIDER_ID,
			  provider: new GoogleLoginProvider(
				"688686179589-2e4vehv846dbemjq5aqts284r3bfhhfu.apps.googleusercontent.com"
			  )
			},
		  ],
		  onError: (err) => {
			console.error(err);
		  }
		} as SocialAuthServiceConfig,
	  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
