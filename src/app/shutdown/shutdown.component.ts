import { Component } from '@angular/core';
import { ShutdownService } from '../shutdown.service';

@Component({
    selector: 'app-shutdown',
    templateUrl: './shutdown.component.html',
    styleUrls: ['./shutdown.component.scss']
})
export class ShutdownComponent {

    constructor(private shutdownService: ShutdownService) {}

    shutdown(): void {
        this.shutdownService.shutdown().subscribe(cmdResp => console.log(cmdResp.status));
    }

    reboot(): void {
        this.shutdownService.reboot().subscribe(cmdResp => console.log(cmdResp.status));
    }
}
