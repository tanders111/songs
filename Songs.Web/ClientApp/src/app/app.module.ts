import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import {FormsModule} from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SongListComponent } from './songs/song-list.component';
import { GlobalErrorHandler } from './shared/global-error-handler'
import { SongComponent } from './songs/song.component';
import { SongPrintComponent } from './songs/song-print.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SongSearchComponent } from './songs/song-search.component';

@NgModule({
  declarations: [
    AppComponent, SongListComponent, SongComponent, SongPrintComponent, SongSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    NgSelectModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


