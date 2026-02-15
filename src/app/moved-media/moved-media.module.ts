import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../security/auth.guard";
import {TranslateModule} from "@ngx-translate/core";
import {MovedMediaSearchComponent} from "./search/search.component";
import {MovedMediaDetailComponent} from "./detail/detail.component";
import {MovedMediaLayoutComponent} from "./layout/layout.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {HttpClientModule} from "@angular/common/http";
import {MovedMediaTVShowComponent} from './tvshow/tvshow.component';
import {MovedMediaTVShowSeasonComponent} from './tvshow-season/tvshow-season.component';

const routes: Routes = [
    {
        path: "", component: MovedMediaLayoutComponent,
        children: [
            {path: 'search', component: MovedMediaSearchComponent, canActivate: [AuthGuard]},
            {path: 'detail/:idx', component: MovedMediaDetailComponent, canActivate: [AuthGuard]},
            {path: 'tv-show/:idx', component: MovedMediaTVShowComponent, canActivate: [AuthGuard]},
            {path: 'tv-show/:idx/season/:nr', component: MovedMediaTVShowSeasonComponent, canActivate: [AuthGuard]},
        ]
    }
];

@NgModule({
    declarations: [
        MovedMediaLayoutComponent,
        MovedMediaSearchComponent,
        MovedMediaDetailComponent,
        MovedMediaTVShowComponent,
        MovedMediaTVShowSeasonComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        HttpClientModule,
        TranslateModule,
        MatButtonModule,
        MatCardModule,
        MatPaginatorModule,
        MatSlideToggleModule,
    ],
    exports: [RouterModule]
})
export class MovedMediaModule {
}
