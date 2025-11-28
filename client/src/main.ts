import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { AuthInterceptor } from './app/services/authInterceptor.service';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      HttpClientModule,
      AppModule
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
}).catch(err => console.error(err));
