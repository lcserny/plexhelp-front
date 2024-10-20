import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {RegisterComponent} from "./register/register.component";
import {TranslateModule} from "@ngx-translate/core";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {LayoutComponent} from "./layout/layout.component";
import {DetailsComponent} from "./details/details.component";
import {ListComponent} from "./list/list.component";
import {AdminAuthGuard, AuthGuard} from "../security/auth.guard";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatMomentDateModule} from "@angular/material-moment-adapter";

const routes: Routes = [
    {
        path: "", component: LayoutComponent,
        children: [
            {path: 'register', component: RegisterComponent},
            {path: 'details/:idx', component: DetailsComponent, canActivate: [AuthGuard]},
            {path: 'list', component: ListComponent, canActivate: [AdminAuthGuard]},
        ]
    }
];

@NgModule({
    declarations: [
        LayoutComponent,
        DetailsComponent,
        RegisterComponent,
        ListComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule,
        MatInputModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatDatepickerModule,
    ],
    exports: [RouterModule],
    providers: [DatePipe]
})
export class UserModule {
}
