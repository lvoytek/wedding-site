import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
	constructor(private http: HttpClient) {}

	get(url: string, options?: any) {
		return this.http.get(`${environment.SERVER_URL}/${url}`, options);
	}

	post(url: string, data: any, options?: any) {
		return this.http.post(
			`${environment.SERVER_URL}/${url}`,
			data,
			options
		);
	}

	put(url: string, data: any, options?: any) {
		return this.http.put(`${environment.SERVER_URL}/${url}`, data, options);
	}

	delete(url: string, options?: any) {
		return this.http.delete(`${environment.SERVER_URL}/${url}`, options);
	}
}
