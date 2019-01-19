import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SongsService, SongSummary } from './songs.service';
import { Observable, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {

  songs: SongSummary[];
  song: SongSummary;

  @Output() onSongSelected: EventEmitter<SongSummary> = new EventEmitter<SongSummary>()

  constructor(private httpClient: SongsService) { }

  async ngOnInit() {
    await this.getSongs();
  }

  async getSongs() {
    let list = await this.httpClient.getSongs();
    this.songs = list;

    let s = localStorage.getItem(this.localKey);

    if (list.length) {
      let ls = list.find(sng => sng.file === s);
      let selected = ls || list[0];
      this.selectSong(selected);
    }
  }

  selectItem(selected: any) {
    //from typeahead
    this.selectSong(selected.item)
  }

  selectSong(s: SongSummary) {
    this.song = s;
    localStorage.setItem(this.localKey, s.file);
    this.onSongSelected.emit(s);

  }

  formatter = (sum: SongSummary) => sum.title;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => {
        let max = 15;
        if (term.length < 1) return [];
        if (term.length === 1) return this.songs.filter(v => v.title.toLowerCase().startsWith(term.toLowerCase())).slice(0, max);
        return this.songs.filter(song => this.matchesToken(song, term.toLowerCase())).slice(0, max);
      }
      )
    )

  matchesToken(s: SongSummary, t: string): boolean {
    if (s.title.toLowerCase().indexOf(t) > -1) return true;

    let found = s.searchTokens.find(tkn => tkn.toLowerCase().indexOf(t) > -1);
    return !!found;
  }

  up() {
    let songs = this.songs;
    let idx = songs.findIndex(s => s === this.song);

    if (idx > 0) this.selectSong(songs[idx -1]);
   }
    
   down() {
    let songs = this.songs;
    let idx = songs.findIndex(s => s === this.song);
    if (idx > this.songs.length) this.song = songs[0];
    else this.selectSong(songs[idx + 1]);
  }

  private localKey: string = 'lastSong';
}
