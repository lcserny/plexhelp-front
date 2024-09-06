import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { MediaDetailComponent } from '../media-detail/media-detail.component';
import { MessagesComponent } from '../messages/messages.component';
import { SearchComponent } from '../search/search.component';
import { ShutdownComponent } from '../shutdown/shutdown.component';
import {AuthGuard} from "../security/auth.guard";

const securityModule = () => import("../security/security.module").then(x => x.SecurityModule);

export const routes: Routes = [
    { path: "search", component: SearchComponent, canActivate: [AuthGuard] },
    { path: "shutdown", component: ShutdownComponent, canActivate: [AuthGuard] },
    { path: "messages", component: MessagesComponent },
    { path: "media-detail/:idx", component: MediaDetailComponent, canActivate: [AuthGuard] },
    { path: "security", loadChildren: securityModule },
    { path: "", component: HomeComponent, canActivate: [AuthGuard] },
    { path: "**", redirectTo: "" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }
