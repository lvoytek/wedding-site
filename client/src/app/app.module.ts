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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RsvpService } from './services/rsvp.service';
import { GuestService } from './services/guest.service';
import { ApiService } from './services/api.service';
import { RsvpFormComponent } from './components/forms/rsvp/rsvp.component';
import { CodeInputFormComponent } from './components/forms/code-input-form/code-input-form.component';
import { AddGuestComponent } from './components/forms/add-guest/add-guest.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminTableComponent } from './components/forms/admin-table/admin-table.component';
import {
	SocialLoginModule,
	SocialAuthServiceConfig,
	GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/authInterceptor.service';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		RsvpComponent,
		InfoComponent,
		RsvpFormComponent,
		AdminComponent,
		AdminTableComponent,
		CodeInputFormComponent,
		AddGuestComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		SocialLoginModule,
	],
	providers: [
		RsvpService,
		GuestService,
		ApiService,
		AuthService,
		{
			provide: 'SocialAuthServiceConfig',
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider(
							'688686179589-2e4vehv846dbemjq5aqts284r3bfhhfu.apps.googleusercontent.com'
						),
					},
				],
				onError: (err) => {
					console.error(err);
				},
			} as SocialAuthServiceConfig,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
