import { Component, OnInit } from '@angular/core';
import {SongSummary, Song, SongsService} from './songs/songs.service'

@Component({
    selector: 'app-root',
    templateUrl: `app.component.html`,
    styles: [],
    standalone: false
})
export class AppComponent implements OnInit {

  printing: boolean;
  song: Song;
  hideSearch = false;

  constructor (private songService: SongsService ) {}

  ngOnInit() {
    // this.songService.getSongs()
    // .then(r => {
    //   console.log('songs loaded');
    //   this.songService.selectSong();
    // });
    
  }

  title = 'songs';
 
}
