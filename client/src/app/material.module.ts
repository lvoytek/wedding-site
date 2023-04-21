import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		MatButtonModule,
		MatToolbarModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatCheckboxModule,
		MatRadioModule
	],
	exports: [
		MatButtonModule,
		MatToolbarModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatCheckboxModule,
		MatTableModule,
		MatGridListModule,
		MatRadioModule
	],
})
export class MaterialModule {}
