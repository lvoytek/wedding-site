import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../services/info.service';
import { faqData } from '@libs/info';

@Component({
	selector: 'app-info',
	templateUrl: './info.component.html',
	styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
	faqs: faqData[] = [];

	constructor(
		private infoService: InfoService
	) {}

	ngOnInit() {
		this.infoService.getAllFaqs().subscribe((data: any) => {
			if(data)
				this.faqs = data;
		});
	}
}
