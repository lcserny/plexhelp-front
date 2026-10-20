import { ChangeDetectorRef, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, skip } from 'rxjs';
import { LoadingService } from '../loading.service';

@Component({
    standalone: false,
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

    constructor(public loadingService: LoadingService, private cdr: ChangeDetectorRef) {
        // The loading flag can flip to false on async completions that don't
        // schedule change detection (e.g. requests finishing right after
        // bootstrap). Refresh this subtree explicitly so the spinner can't
        // get stuck on screen. skip(1) ignores the BehaviorSubject replay so
        // we never re-enter change detection while this view is being created.
        this.loadingService.loading$.pipe(
            skip(1),
            distinctUntilChanged(),
            takeUntilDestroyed()
        ).subscribe(() => this.cdr.detectChanges());
    }
}
