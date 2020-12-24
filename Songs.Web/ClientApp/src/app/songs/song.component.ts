import { Component, OnInit, AfterViewInit, Input, Output, OnChanges, EventEmitter, NgZone, ViewChild, HostListener } from '@angular/core';
import { SongsService, SongSummary, Song, Block, Zoom } from './songs.service';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Icons } from '../icons';

@Component({
  selector: 'song',
  templateUrl: './song.component.html',
  styles: [
    `.compact-select {width: 100%}
    .full-select {width: 260px;}
    body { background-color: #556}
    `]
})
export class SongComponent implements OnInit {

  @Output() onPrint: EventEmitter<Song> = new EventEmitter<Song>();

  song: Song;
  ui: any = {}
  icons = new Icons();

  get songs() : SongSummary[] {
    return this.songService.songs;
  }

  get songSummary() : SongSummary {
    return this.songService.song;
  }

  zoom: Zoom;

  singleColumn: boolean = false;
  hideList: boolean = true;

  constructor(
    private songService: SongsService,
    private zone: NgZone
  ) { }

  async ngOnInit() {

    this.songService.onSongSelected
      .subscribe(s => this.refresh()
      .then(r => console.log('refreshed')));

    fromEvent(window, 'resize')
        .pipe(
            debounceTime(500)
        )
        .subscribe((val) => this.zoom.parse());  
  }

  dim() {
    return window.innerHeight + 'x' + window.innerWidth;
  }
 

  private async refresh() {
    try {
      if (!this.songSummary) return;

      this.song = await this.songService.getSong(this.songSummary);

      this.zoom = new Zoom(this.song, false);

      this.zoom.parse();

      this.singleColumn = this.zoom.compact;

      console.info('loaded ' + this.songSummary.file, this.song)

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

  async toggleHideList() {
    this.hideList = !this.hideList;
    this.zone.run(() => { });
  }
}

