import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms'
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
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SongsService } from './songs/songs.service';
import { WordComponent } from './words/word.component';
import { Icons } from './icons';

@NgModule({
  declarations: [
    AppComponent, SongListComponent, SongComponent, SongPrintComponent, SongSearchComponent, WordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (cfg: SongsService) => () => cfg.load(),
      multi: true,
      deps: [SongsService]
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(library: FaIconLibrary) {
    let icons = new Icons().allIcons();
    library.addIcons(...icons);
  }
}