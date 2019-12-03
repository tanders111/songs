import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SongsService, SongSummary } from './songs.service';
import { Observable, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {

  @Input() showList = true;
  @Input() showSelect = false;

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


  up() {
    let songs = this.songs;
    let idx = songs.findIndex(s => s === this.song);

    if (idx > 0) this.songService.selectSong(songs[idx -1]);
   }
    
   down() {
    let songs = this.songs;
    let idx = songs.findIndex(s => s === this.song);
    
    if (idx > this.songs.length) this.songService.selectSong(this.songs[0])
    else this.songService.selectSong(songs[idx + 1]);
  }

  
}
