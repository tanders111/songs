import { Component, OnInit, AfterViewInit, Input, Output , OnChanges, EventEmitter, ElementRef, ViewChild, HostListener} from '@angular/core';
import { SongsService, SongSummary, Song, Block, Zoom} from './songs.service';
import { parse } from 'querystring';

@Component({
  selector: 'song',
  templateUrl: './song.component.html',
  styleUrls: []
})
export class SongComponent implements OnInit {

  
  @Input() songSummary: SongSummary;
  @Output() onPrint: EventEmitter<Song> = new EventEmitter<Song>();

  song: Song;
  zoom: Zoom;

  singleColumn: boolean = false;
  
  constructor(private songService: SongsService) { }

  async ngOnInit() {
   
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
  screenChanged() {
    //if we want to change blocks on screen size change
     let height = window.innerHeight;
  }

  print() {
    this.onPrint.emit(this.song);
    //window.print();
  }
}

