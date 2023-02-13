import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { RsvpComponent } from './components/rsvp/rsvp.component';

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
