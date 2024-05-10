import { Component, OnInit, AfterViewInit, Input, Output, OnChanges, EventEmitter, NgZone, ViewChild, HostListener } from '@angular/core';
import { SongsService, SongSummary, Song, Block, Zoom } from './songs.service';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Icons } from '../icons';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'song',
  templateUrl: './song.component.html',
  styles: [
    `.compact-select {width: 100%}
    .full-select {width: 260px;}
    body { background-color: #556}
    `]
})
export class SongComponent  implements OnInit {

  @Output() onPrint: EventEmitter<Song> = new EventEmitter<Song>();

  song: Song;
  ui: any = {}
  icons = new Icons();

  get songs() : SongSummary[] {
    return this.songService.songs;
  }

  get songSummary(): SongSummary {
    return this.song.summary;
  }

  file: string;

  zoom: Zoom;

  singleColumn: boolean = false;
  showList = false;

  constructor(
    private songService: SongsService,
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {

    this.route.params.subscribe(async (p: Params) => {
      let file = p['file'];
      this.file = file;
      await this.refresh(file);
    });
    

    fromEvent(window, 'resize')
        .pipe(
            debounceTime(500)
        )
        .subscribe((val) => this.zoom.parse());  
  }

  private async refresh(file: string) {

    this.song = await this.songService.getSongByFile(file);

    this.zoom = new Zoom(this.song, false);

    this.zoom.parse();

    this.singleColumn = this.zoom.compact;
  }

  dim() {
    return window.innerHeight + 'x' + window.innerWidth;
  }
 
  print() {
    if (this.song.summary)
      this.router.navigate(['print', this.song.summary.file]);
    else
      alert('no summary in song');
  }

  words() {
    this.router.navigate(['words']);
  }

  async toggleList() {
    this.showList = !this.showList; 
    //this.zone.run(() => { });
  }

  canDeactivate() { return true; }
}

