import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { FormsModule } from '@angular/forms';

// MODULES
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AngularDraggableModule } from 'angular2-draggable';
import { SortablejsModule } from 'ngx-sortablejs';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// DIRECTIVES
import { DndFileUploadDirective } from './directives/dndFileUpload/dnd-file-upload.directive';

// PAGES
import { LoginComponent } from './pages/auth/login/login.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { ValidinComponent } from './pages/auth/validin/validin.component';
import { PwForgotComponent } from './pages/auth/pw-forgot/pw-forgot.component';
import { PwResetComponent } from './pages/auth/pw-reset/pw-reset.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TestsApiComponent } from './pages/tests/api/api.component';

// COMPONENTS
import { UploadsDatasetComponent } from './components/modals/uploads-dataset/uploads-dataset.component';
import { ReportComponent } from './components/report/report.component';
import { PlayersAdvancedSelectComponent } from './components/modals/players-advanced-select/players-advanced-select.component';
import { TennisFieldComponent } from './components/tennis-field/tennis-field.component';
import { MatchInfoComponent } from './components/report/templates/match-info/match-info.component';
import { GeneralStatsComponent } from './components/report/templates/general-stats/general-stats.component';
import { SummaryComponent } from './components/report/templates/summary/summary.component';
import { TextBlockComponent } from './components/report/templates/text-block/text-block.component';
import { HighlightsComponent } from './components/report/templates/highlights/highlights.component';
import { SmartdataComponent } from './components/report/templates/smartdata/smartdata.component';
import { InsightComponent } from './components/report/templates/insight/insight.component';
import { VideoGalleryComponent } from './components/report/templates/video-gallery/video-gallery.component';
import { PicturesComponent } from './components/report/templates/pictures/pictures.component';
import { RoundPercentageComponent } from './components/round-percentage/round-percentage.component';
import { GeneralStatsRowsComponent } from './components/report/templates/general-stats/general-stats-rows/general-stats-rows.component';
import { SimulationComponent } from './components/tennis-field/simulation/simulation.component';
import { DataViewComponent } from './components/tennis-field/data-view/data-view.component';
import { ServeStatsComponent } from './components/tennis-field/simulation/serve-stats/serve-stats.component';
import { ServeFieldComponent } from './components/tennis-field/simulation/serve-field/serve-field.component';
import { ServeInsightComponent } from './components/tennis-field/simulation/serve-insight/serve-insight.component';
import { VideoViewComponent } from './components/tennis-field/video-view/video-view.component';
import { DatasetsManagementComponent } from './pages/datasets-management/datasets-management.component';
import { ReportsManagementComponent } from './pages/reports-management/reports-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SigninComponent,
        ValidinComponent,
        PwForgotComponent,
        PwResetComponent,
        DashboardComponent,
        UploadsDatasetComponent,
        TestsApiComponent,
        DndFileUploadDirective,
        ReportComponent,
        PlayersAdvancedSelectComponent,
        TennisFieldComponent,
        MatchInfoComponent,
        GeneralStatsComponent,
        SummaryComponent,
        TextBlockComponent,
        HighlightsComponent,
        SmartdataComponent,
        InsightComponent,
        VideoGalleryComponent,
        PicturesComponent,
        RoundPercentageComponent,
        GeneralStatsRowsComponent,
        SimulationComponent,
        DataViewComponent,
        ServeStatsComponent,
        ServeFieldComponent,
        ServeInsightComponent,
        VideoViewComponent,
        DatasetsManagementComponent,
        ReportsManagementComponent,
        UserManagementComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        FormsModule,
        AngularMultiSelectModule,
        AngularMyDatePickerModule,
        AngularDraggableModule,
        SortablejsModule.forRoot({ animation: 150 }),
        NgxDatatableModule,
        RoundProgressModule
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
