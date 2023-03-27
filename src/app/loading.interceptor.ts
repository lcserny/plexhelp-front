import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    private totalRequests = 0;

    constructor(private loaderService: LoaderService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        console.log("caught");
        this.totalRequests++;
        this.loaderService.setLoading(true);

        return next.handle(request).pipe(
            finalize(() => {
                this.totalRequests--;
                // setTimeout(() => {
                    if (this.totalRequests == 0) {
                        this.loaderService.setLoading(false);
                    }
                // }, 2500);
            })
        );
    }
}
