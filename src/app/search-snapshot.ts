import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class SearchSnapshot {

    private searches: string[] = [];
    private currentIndex = 0;

    initSearches() {
        this.searches = [
            "one",
            "two",
            "three"
        ];
        this.currentIndex = 0;
    }

    getNextSearch(): string {
        if (this.searches.length <= 0) {
            return "";
        }
        if (!this.searches[this.currentIndex]) {
            return "";
        }
        let search = this.searches[this.currentIndex];
        this.currentIndex++;
        if (this.currentIndex == this.searches.length) {
            this.currentIndex = 0;
        }
        return search; 
    }
}