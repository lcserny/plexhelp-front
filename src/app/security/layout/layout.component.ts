import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-layout',
    template: "<router-outlet></router-outlet>",
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LayoutComponent {
}
