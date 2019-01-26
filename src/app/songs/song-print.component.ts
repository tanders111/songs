import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { SongsService, SongSummary, Song, Block, Zoom } from './songs.service';
import { parse } from 'querystring';

@Component({
  selector: 'song-print',
  templateUrl: './song-print.component.html',
  styleUrls: ['song-print.component.scss']
})
export class SongPrintComponent implements OnInit {

  @Input() song: Song;
  @Output() done: EventEmitter<boolean> = new EventEmitter<boolean>();

  printSong: Song;
  singleColumn = false;
  zoom: Zoom;

  constructor(private songService: SongsService) { }

  async ngOnInit() {

  }

  async ngOnChanges() {
    await this.refresh();
  }

  async refresh() {
    //re-retrieve the song for printing so we can modify parsing without messing up the display
    let p = await (this.songService.getSong(this.song.summary));
    this.printSong = p;
    this.zoom = new Zoom(p);
    this.zoom.parse();
  }

  back() {
    this.done.emit(true);
  }

  print() {
    window.print();
  }

}

