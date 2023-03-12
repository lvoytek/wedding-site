import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
	providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    constructor(public authService: AuthService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return from(this.handleAccess(request, next));
    }

    private async handleAccess(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Promise<HttpEvent<any>> {
        const token = this.authService.token;

        let changedRequest = request;
        const headerSettings: { [name: string]: string | string[] } = {};

        if (token) {
            headerSettings['Authorization'] = 'Bearer ' + token;
        }

        const newHeader = new HttpHeaders(headerSettings);

        changedRequest = request.clone({
            headers: newHeader,
        });

        return next.handle(changedRequest).toPromise() as Promise<HttpEvent<any>>;
    }
}
