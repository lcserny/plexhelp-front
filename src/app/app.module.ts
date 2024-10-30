import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
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
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
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
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MAT_DATE_FORMATS} from "@angular/material/core";
import { ListComponent } from './magnets/list/list.component';
import {MatTableModule} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import { AddDialogComponent } from './magnets/add-dialog/add-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

export const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'YYYY-MM-DD', // The format used when parsing input
    },
    display: {
        dateInput: 'YYYY-MM-DD', // The format used for displaying the date
        monthYearLabel: 'MMM YYYY', // The format for the month-year label on the calendar
        dateA11yLabel: 'LL', // Accessibility format
        monthYearA11yLabel: 'MMMM YYYY', // Accessibility month-year format
    }
};

export const OPENAPI_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSS[Z]";

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
        ListComponent,
        AddDialogComponent,
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
        MatMomentDateModule,
        MatTableModule,
        MatDialogModule,
        MatButtonToggleModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: MatPaginatorIntl, useClass: TranslatedPaginator},
        {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
        DatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
