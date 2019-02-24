import { Component, OnInit, AfterViewInit, Input, Output, OnChanges, EventEmitter, NgZone, ViewChild, HostListener } from '@angular/core';
import { SongsService, SongSummary, Song, Block, Zoom } from './songs.service';
import { parse } from 'querystring';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'song',
  templateUrl: './song.component.html',
  styleUrls: []
})
export class SongComponent implements OnInit {


  @Input() songSummary: SongSummary;
  @Output() onPrint: EventEmitter<Song> = new EventEmitter<Song>();
  @Output() onSearchToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  song: Song;
  zoom: Zoom;

  singleColumn: boolean = false;
  hideSearch: boolean = false;

  constructor(private songService: SongsService,
    private zone: NgZone) { }

  async ngOnInit() {

    fromEvent(window, 'resize')
        .pipe(
            debounceTime(500)
        )
        .subscribe((val) => this.zoom.parse());
  }

  async ngOnChanges() {
    await this.refresh();
  }

  async refresh() {
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
    this.onSearchToggle.emit(this.hideSearch);
    this.zone.run(() => { });
  }
}

