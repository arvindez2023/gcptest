import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '@fake-db/fake-db.service';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';

import { coreConfig } from 'app/app-config';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { fakeBackendProvider } from 'app/auth/helpers'; // used to create fake backend
import { JwtInterceptor, ErrorInterceptor } from 'app/auth/helpers';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { LoadingModule } from 'ngx-loading';

const appRoutes: Routes = [
    
    //{
    //    path: 'apps',
    //    loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule),
    //    canActivate: [AuthGuard]
    //},
    {
        path: 'components',
        loadChildren: () => import('./main/components/components.module').then(m => m.ComponentsModule),
        canActivate: [AuthGuard]
    },
    {
        path: '',
        loadChildren: () => import('./home/homedata.module').then(m => m.HomeModule)
    }
    ,
    {
        path: 'auth',
        loadChildren: () => import('./authpage/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('./main/clinic-admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard]
    }
    ,

    {
        path: '**',
        loadChildren: () => import('./miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule),
    }
    
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        LoadingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),
        RouterModule.forRoot(appRoutes, {
            scrollPositionRestoration: 'enabled',
            relativeLinkResolution: 'legacy'
        }),
        NgbModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        ContextMenuModule,
        CoreModule.forRoot(coreConfig),
        CoreCommonModule,
        CoreSidebarModule,
        CoreThemeCustomizerModule,
        CardSnippetModule,
        LayoutModule,
        ContentHeaderModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // ! IMPORTANT: Provider used to create fake backend, comment while using real API
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }