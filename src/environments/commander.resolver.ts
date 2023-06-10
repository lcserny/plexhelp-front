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

        let domain = environment.commander.hostname;
        let port = environment.commander.port;
        let uri = environment.commander.uri;

        if (environment.commander.useFrontHost) {
            let protocol = this.document.location.protocol;
            let hostname = this.document.location.hostname;
            domain = `${protocol}//${hostname}`;
        }

        this.cachedApiUrl = `${domain}:${port}${uri}`;
        return this.cachedApiUrl;
    }
}