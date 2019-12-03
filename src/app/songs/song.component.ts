import { Component, OnInit, AfterViewInit, Input, Output, OnChanges, EventEmitter, NgZone, ViewChild, HostListener } from '@angular/core';
import { SongsService, SongSummary, Song, Block, Zoom } from './songs.service';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'song',
  templateUrl: './song.component.html',
  styles: [
    `.compact-select {width: 100%}
    .full-select {width: 260px;}
    `]
})
export class SongComponent implements OnInit {



  @Output() onPrint: EventEmitter<Song> = new EventEmitter<Song>();
  
  showSelect = true;
  
  song: Song;
  ui: any = {}

  get songs() : SongSummary[] {
    return this.songService.songs;
  }

  get songSummary() : SongSummary {
    return this.songService.song;
  }

  zoom: Zoom;

  singleColumn: boolean = false;
  hideSearch: boolean = true;

  constructor(private songService: SongsService,
    private zone: NgZone) { }

  async ngOnInit() {

    this.songService.onSongSelected.subscribe(s => this.refresh()
    .then(r => console.log('refreshed')));

    fromEvent(window, 'resize')
        .pipe(
            debounceTime(500)
        )
        .subscribe((val) => this.zoom.parse());  
  }

  songMatches(term: string, item: any) {
    return SongsService.matchesToken(item, term);
  }

  dim() {
    return window.innerHeight + 'x' + window.innerWidth;
  }
  async ngOnChanges() {
    await this.refresh();
  }

  private async refresh() {
    try {
      if (!this.songSummary) return;

      this.song = await this.songService.getSong(this.songSummary);

      this.zoom = new Zoom(this.song, false);

      this.zoom.parse();

      console.info('got song from ' + this.songSummary.file, this.song)

    } catch (e) {
      console.error('error getting song ', e);
      alert('error see log ' + e.message);
    }
  }

  async songSelected(song: SongSummary) {
    this.songService.selectSong(song);
    await this.refresh().then(x => console.log('refreshed'));
  }

  @HostListener('window:resize', ['$event'])
  async screenChanged() {
    //if we want to change blocks on screen size change
    let height = window.innerHeight;//console.log('h',height);
    //await this.refresh();

  }

  print() {
    this.onPrint.emit(this.song);
    //window.print();
  }

  async toggleSearch() {
    this.hideSearch = !this.hideSearch;
    this.zone.run(() => { });
  }
}

