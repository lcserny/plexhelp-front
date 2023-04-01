import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LoadingComponent } from './loading/loading.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './loading.interceptor';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './routing/routing.module';
import { SearchComponent } from './search/search.component';
import { MediaDetailComponent } from './media-detail/media-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        LoadingComponent,
        SearchComponent,
        MediaDetailComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }],
    bootstrap: [AppComponent]
})
export class AppModule { }
