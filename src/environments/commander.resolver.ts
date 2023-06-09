import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { environment } from "./environment";

@Injectable({
    providedIn: 'root'
})
export class CommanderApiUrlResolver {

    private cachedApiUrl?: string;

    constructor (@Inject(DOCUMENT) private document: Document) {}

    produceCommanderApiUrlBase(): string {
        if (this.cachedApiUrl) {
            return this.cachedApiUrl;
        }

        if (environment.commanderUsesSameHost) {
            let protocol = this.document.location.protocol;
            let hostname = this.document.location.hostname;
            this.cachedApiUrl = `${protocol}//${hostname}:${environment.commanderPort}${environment.commanderApiUri}`;
            return this.cachedApiUrl;
        } else {
            this.cachedApiUrl = environment.commanderApiUrlBase;
            return this.cachedApiUrl;
        }
    }
}