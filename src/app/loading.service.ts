import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private static readonly timeoutMs = 60000;

    private loading: boolean = false;
    private pinned: boolean = false;
    private pinnedTimestamp: number | null = null;
    private timer: any = null;

    private loadingSubject = new BehaviorSubject<boolean>(false);
    readonly loading$ = this.loadingSubject.asObservable();

    constructor() { }

    setLoading(loading: boolean) {
        if (this.pinned) {
            return;
        }
        this.updateLoading(loading);
    }

    setPinnedLoading(loading: boolean) {
        this.resetTimerIfNeeded();

        this.pinned = loading;
        this.updateLoading(loading);

        if (loading) {
            this.pinnedTimestamp = Date.now();
            this.scheduleTimer();
        } else {
            this.pinnedTimestamp = null;
        }
    }

    getLoading(): boolean {
        return this.loading;
    }

    private updateLoading(loading: boolean) {
        if (this.loading !== loading) {
            this.loading = loading;
            this.loadingSubject.next(loading);
        }
    }

    private scheduleTimer() {
        this.timer = setTimeout(() => {
            if (this.pinnedTimestamp && (Date.now() - this.pinnedTimestamp >= LoadingService.timeoutMs)) {
                this.pinned = false;
                this.updateLoading(false);
            }
        }, LoadingService.timeoutMs);
    }

    private resetTimerIfNeeded() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
