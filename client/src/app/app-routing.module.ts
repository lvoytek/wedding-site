import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { RsvpComponent } from './components/rsvp/rsvp.component';

const routes: Routes = [
	{ path: 'info', component: InfoComponent, data: { title: 'Info' } },
	{ path: 'rsvp', component: RsvpComponent, data: { title: 'RSVP' } },
	{ path: 'admin', component: AdminComponent, data: { title: 'Admin' } },
	{ path: '**', component: HomeComponent },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
