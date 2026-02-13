import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { MediaDetailComponent } from '../media-detail/media-detail.component';
import { MessagesComponent } from '../messages/messages.component';
import { SearchComponent } from '../search/search.component';
import { ShutdownComponent } from '../shutdown/shutdown.component';
import {AdminAuthGuard, AuthGuard} from "../security/auth.guard";
import {MagDownTabsComponent as MagnetsDownloadsTabsComponent} from "../magnets-downloads/tabs/mag-down-tabs.component";

const securityModule = () => import("../security/security.module").then(x => x.SecurityModule);
const userModule = () => import("../user/user.module").then(x => x.UserModule);
const movedMediaModule = () => import("../moved-media/moved-media.module").then(x => x.MovedMediaModule);

export const routes: Routes = [
    { path: "search", component: SearchComponent, canActivate: [AuthGuard] },
    { path: "shutdown", component: ShutdownComponent, canActivate: [AdminAuthGuard] },
    { path: "magnets-downloads/:idx", component: MagnetsDownloadsTabsComponent, canActivate: [AuthGuard] },
    { path: "messages", component: MessagesComponent },
    { path: "media-detail", component: MediaDetailComponent, canActivate: [AuthGuard] },
    { path: "security", loadChildren: securityModule },
    { path: "user", loadChildren: userModule },
    { path: "moved-media", loadChildren: movedMediaModule },
    { path: "", component: HomeComponent, canActivate: [AuthGuard] },
    { path: "**", redirectTo: "" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }
