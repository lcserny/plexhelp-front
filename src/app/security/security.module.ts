import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LayoutComponent} from "./layout/layout.component";
import {LoginComponent} from "./login/login.component";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
    {
        path: "", component: LayoutComponent,
        children: [
            {path: 'login', component: LoginComponent},
        ]
    }
];

@NgModule({
    declarations: [
        LayoutComponent,
        LoginComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule
    ],
    exports: [RouterModule]
})
export class SecurityModule {
}
