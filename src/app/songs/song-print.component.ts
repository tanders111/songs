import { Component, OnInit, Input, Output , OnChanges, EventEmitter} from '@angular/core';
import { SongsService, SongSummary, Song, Block} from './songs.service';
import { parse } from 'querystring';

@Component({
  selector: 'song-print',
  templateUrl: './song-print.component.html',
  styleUrls: ['song-print.component.scss']
})
export class SongPrintComponent implements OnInit {

  @Input() song: Song;
  @Output() done: EventEmitter<boolean>  = new EventEmitter<boolean>();

  constructor(private songService: SongsService) { }

  async ngOnInit() {
   
  }

  async ngOnChanges() {
   
  }

  back() {
    this.done.emit(true);
  }

  print() {
    window.print();
  }
}

