import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {SongSummary, Song} from './songs/songs.service'

@Component({
  selector: 'app-root',
  templateUrl: `app.component.html`,
  styles: []
})
export class AppComponent {


  songs: SongSummary[];
  selectedSong: SongSummary;
  printing: boolean;
  song: Song;

  constructor ( ) {}

  title = 'songs';

  selectSong(summary: SongSummary) {
    this.selectedSong = summary;
  }

  print(song: Song) {
    this.song = song;

    this.printing = true;
    //setTimeout(() => window.print());
  }
}
