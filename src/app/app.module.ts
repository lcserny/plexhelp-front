import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent, CustomDateAdapter} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationComponent} from './navigation/navigation.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet'
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoadingComponent} from './loading/loading.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {LoadingInterceptor} from './loading.interceptor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RoutingModule} from './routing/routing.module';
import {SearchComponent} from './search/search.component';
import {MediaDetailComponent} from './media-detail/media-detail.component';
import {HomeComponent} from './home/home.component';
import {MessagesComponent} from './messages/messages.component';
import {MediaDetailOptionsComponent} from './media-detail-options/media-detail-options.component';
import {ShutdownComponent} from './shutdown/shutdown.component';
import {TextFieldModule} from "@angular/cdk/text-field";
import {JwtInterceptor} from "./security/jwt.interceptor";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {TranslatedPaginator} from "./custom.paginator";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {
    DateAdapter,
    MAT_DATE_LOCALE,
    MatNativeDateModule,
} from "@angular/material/core";
import {MagnetsListComponent} from './magnets/list/magnets-list.component';
import {MatTableModule} from "@angular/material/table";
import {DATE_PIPE_DEFAULT_OPTIONS, DatePipe, NgOptimizedImage} from "@angular/common";
import {AddDialogComponent} from './magnets/add-dialog/add-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {DownloadsListComponent} from './downloads/list/downloads-list.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MagDownTabsComponent} from "./magnets-downloads/tabs/mag-down-tabs.component";
import {environment} from "../environments/environment";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        LoadingComponent,
        SearchComponent,
        MediaDetailComponent,
        HomeComponent,
        MessagesComponent,
        MediaDetailOptionsComponent,
        ShutdownComponent,
        MagnetsListComponent,
        AddDialogComponent,
        DownloadsListComponent,
        MagDownTabsComponent
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
        MatListModule,
        MatCardModule,
        MatBottomSheetModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        MatSnackBarModule,
        MatMenuModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })),
        MatPaginatorModule,
        MatSlideToggleModule,
        MatTableModule,
        MatDialogModule,
        MatButtonToggleModule,
        MatGridListModule,
        MatTooltipModule,
        MatTabsModule,
        MatDatepickerModule,
        MatCheckboxModule,
        NgOptimizedImage,
        MatNativeDateModule
    ],
    providers: [
        {provide: DateAdapter, useClass: CustomDateAdapter},
        {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: MatPaginatorIntl, useClass: TranslatedPaginator},
        {provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { dateFormat: environment.region.dateFormat, timezone: environment.region.timezone }},
        {provide: MAT_DATE_LOCALE, useValue: environment.region.locale},
        DatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
