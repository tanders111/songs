import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SongsService, SongSummary } from './songs.service';
import { Observable, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Icons } from '../icons';
import { Router } from '@angular/router';

@Component({
    selector: 'song-search',
    templateUrl: './song-search.component.html',
    styleUrls: [],
    standalone: false
})
export class SongSearchComponent implements OnInit {

  @Output() onSongSelected: EventEmitter<SongSummary>;

  icons = new Icons();
  
  get songs(): SongSummary[] { 
    return this.songService.songs; 
  };

  song: SongSummary;


  constructor(private songService: SongsService, private router: Router) {
   
   }

  async ngOnInit() {
    //await this.songService.getSongs();
    //this.songService.selectSong();
  }

  selectItem(selected: any) {
    console.log('selected', selected);
    this.song = selected.item;

    this.songService.selectSong(this.song);
  }

  formatter = (sum: SongSummary) => sum.title;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => this.songService.filterSongs(term))
    )
  
  selectText(event: EventTarget) {
    let h = event as HTMLInputElement;
    h.select();
  }
}
