import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SongsService, SongSummary } from './songs.service';
import { Observable, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {

  @Input() showList = true;
  @Input() showSelect = false;

  get songs(): SongSummary[] { 
    return this.songService.songs; 
  };

  @Input() song: SongSummary;

 
  constructor(private songService: SongsService, private router: Router) { }

  async ngOnInit() {
    await this.songService.getSongs();
    this.songService.selectSong();
  }

  selectItem(selected: any) {
    
    let summary = selected.item;
    console.log('selected', summary);
    this.songService.selectSong(summary);
    
  }

  formatter = (sum: SongSummary) => sum.title;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => this.songService.filterSongs(term))
    )


  up() {
    let songs = this.songs;
    let idx = songs.findIndex(s => s === this.song);

    if (idx > 0) {
      let song = songs[idx - 1];
      this.songService.selectSong(song);
    }

  }

   down() {
    let songs = this.songs;
    let idx = songs.findIndex(s => s === this.song);
    
     if (idx > this.songs.length)
       this.songService.selectSong(this.songs[0])
     else
       this.songService.selectSong(songs[idx + 1]);
  }

  
}
