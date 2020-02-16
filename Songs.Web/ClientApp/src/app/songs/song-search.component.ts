import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SongsService, SongSummary } from './songs.service';
import { Observable, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'song-search',
  templateUrl: './song-search.component.html',
  styleUrls: []
})
export class SongSearchComponent implements OnInit {

  @Output() onSongSelected: EventEmitter<SongSummary>;

  get songs(): SongSummary[] { 
    return this.songService.songs; 
  };

  get song(): SongSummary {
    return this.songService.song;
  };

 
  constructor(private songService: SongsService) {
    this.onSongSelected = this.songService.onSongSelected;
   }

  async ngOnInit() {
    await this.songService.getSongs();
    this.songService.selectSong();
  }

  selectItem(selected: any) {console.log('selected', selected);
    this.songService.selectSong(selected.item)
  }

  formatter = (sum: SongSummary) => sum.title;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => this.songService.filterSongs(term))
    )
  
}
