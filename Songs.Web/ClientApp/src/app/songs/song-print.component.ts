import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Icons } from '../icons';
import { SongsService, SongSummary, Song, Block, Zoom } from './songs.service';

@Component({
    selector: 'song-print',
    templateUrl: './song-print.component.html',
    styleUrls: ['song-print.component.scss'],
    standalone: false
})
export class SongPrintComponent implements OnInit {

  @Input() song: Song;
  @Output() done: EventEmitter<boolean> = new EventEmitter<boolean>();

  printSong: Song;
  singleColumn = false;
  zoom: Zoom;
  icons = new Icons();

  constructor(private songService: SongsService, private route: ActivatedRoute) { }

  async ngOnInit() {

    let file = this.route.snapshot.paramMap.get('file');
    console.error('file', file), this.route;

    this.song = await this.songService.getSongByFile(file);
    this.printSong = this.song;

    this.zoom = new Zoom(this.song);

    this.zoom.parse();

  }

  async ngOnChanges() {

  }

 

  back() {
    this.songService.selectSong(this.song.summary);
  }

  print() {
    window.print();
  }

}

