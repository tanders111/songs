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

  printSong: Song;

  constructor(private songService: SongsService) { }

  async ngOnInit() {
   
  }

  async ngOnChanges() {
    
    //re-retrieve the song for printing so we can modify parsing without messing up the display
    let p = await (this.songService.getSong(this.song.summary));

    p.parse(95);

    this.printSong = p;
  }

  back() {
    this.done.emit(true);
  }

  print() {
    window.print();
  }
}

