import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private static readonly timeoutMs = 60000;

    private loading: boolean = false;
    private pinned: boolean = false;
    private pinnedTimestamp: number | null = null;
    private timer: any = null;

    constructor() { }

    setLoading(loading: boolean) {
        if (this.pinned) {
            return;
        }
        this.loading = loading;
    }

    setPinnedLoading(loading: boolean) {
        this.resetTimerIfNeeded();

        this.pinned = loading;
        this.loading = loading;

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

    private scheduleTimer() {
        this.timer = setTimeout(() => {
            if (this.pinnedTimestamp && (Date.now() - this.pinnedTimestamp >= LoadingService.timeoutMs)) {
                this.pinned = false;
                this.loading = false;
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
