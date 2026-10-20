import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
  selector: 'app-mag-down-tabs',
  templateUrl: './mag-down-tabs.component.html',
  styleUrls: ['./mag-down-tabs.component.scss']
})
export class MagDownTabsComponent implements OnInit {

    selectedTabIndex = 0;

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const tabId = +params['idx'];
            this.selectedTabIndex = tabId || 0;
        });
    }

    onTabChange(index: number) {
        // selectedIndexChange also fires on programmatic sets (route -> tab),
        // so skip the navigation when we're already on the target URL instead
        // of ping-ponging the router (and re-running AuthGuard) on every switch.
        if (this.router.url !== `/magnets-downloads/${index}`) {
            this.router.navigate([`/magnets-downloads/${index}`]);
        }
    }
}
