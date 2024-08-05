import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { MediaDetailComponent } from '../media-detail/media-detail.component';
import { MessagesComponent } from '../messages/messages.component';
import { SearchComponent } from '../search/search.component';
import { ShutdownComponent } from '../shutdown/shutdown.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "search", component: SearchComponent },
    { path: "shutdown", component: ShutdownComponent },
    { path: "messages", component: MessagesComponent },
    { path: "media-detail/:idx", component: MediaDetailComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }
