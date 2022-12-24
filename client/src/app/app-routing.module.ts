import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { RsvpComponent } from './rsvp/rsvp.component';

const routes: Routes = [
  { path: 'info', component: InfoComponent },
  { path: 'rsvp', component: RsvpComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
