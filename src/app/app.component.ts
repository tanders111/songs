import { Component, OnInit } from '@angular/core';
import {SongSummary, Song, SongsService} from './songs/songs.service'

@Component({
  selector: 'app-root',
  templateUrl: `app.component.html`,
  styles: []
})
export class AppComponent implements OnInit {



  get selectedSong(): SongSummary {
    return this.songService.song;
  }

  printing: boolean;
  song: Song;
  hideSearch = false;

  constructor (private songService: SongsService ) {}

  ngOnInit() {
    this.songService.getSongs()
    .then(r => {
      console.log('songs loaded');
      this.songService.selectSong();
    });
    
  }

  title = 'songs';

  
  print(song: Song) {
    this.song = song;

    this.printing = true;
  }
}
