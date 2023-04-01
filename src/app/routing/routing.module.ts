import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaDetailComponent } from '../media-detail/media-detail.component';
import { SearchComponent } from '../search/search.component';

const routes: Routes = [
    { path: "", redirectTo: "/search", pathMatch: "full" },
    { path: "search", component: SearchComponent },
    { path: "media-detail/:idx", component: MediaDetailComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }
