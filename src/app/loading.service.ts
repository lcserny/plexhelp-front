import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private loading: boolean = false;
    private pinned: boolean = false;

    constructor() { }

    setLoading(loading: boolean) {
        if (this.pinned) {
            return;
        }
        this.loading = loading;
    }

    setPinnedLoading(loading: boolean) {
        this.pinned = loading;
        this.loading = loading;
    }

    getLoading(): boolean {
        return this.loading;
    }
}
