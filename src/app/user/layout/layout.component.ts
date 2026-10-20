import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-layout-user',
    template: "<router-outlet></router-outlet>",
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LayoutComponent {
}
