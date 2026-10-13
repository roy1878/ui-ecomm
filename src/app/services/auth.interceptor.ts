import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private encryptionService: EncryptionService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');

    // For auth endpoints, only add token if available
    if (isAuthRequest) {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(authReq);
      }
      return next.handle(req);
    }

    // For other endpoints, add token and handle encryption/decryption
    const token = sessionStorage.getItem('authToken');

    let encryptedReq = req;

    // Encrypt request body if it exists and is not a GET request
    if (req.body && req.method !== 'GET') {
      const encryptedBody = this.encryptionService.encrypt(req.body);
      encryptedReq = req.clone({
        body: { encryptedData: encryptedBody },
        setHeaders: {
          'Content-Type': 'application/json',
          'X-Encrypted': 'true'
        }
      });
    }

    // Add authorization token
    if (token) {
      encryptedReq = encryptedReq.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Handle response decryption
    return next.handle(encryptedReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body.encryptedData) {
            const decryptedBody = this.encryptionService.decrypt(event.body.encryptedData);
            return event.clone({ body: decryptedBody });
          }
        }
        return event;
      })
    );
  }
}
