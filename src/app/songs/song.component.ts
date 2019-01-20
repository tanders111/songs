import { Component, OnInit, AfterViewInit, Input, Output , OnChanges, EventEmitter, ElementRef, ViewChild, HostListener} from '@angular/core';
import { SongsService, SongSummary, Song, Block} from './songs.service';
import { parse } from 'querystring';

@Component({
  selector: 'song',
  templateUrl: './song.component.html',
  styleUrls: []
})
export class SongComponent implements OnInit {

  
  @Input() songSummary: SongSummary;
  @Output() onPrint: EventEmitter<Song> = new EventEmitter<Song>();

  song: any;

  constructor(private songService: SongsService) { }

  async ngOnInit() {
   
  }

  async ngOnChanges() {
      setTimeout(async () => await this.refresh());
  }

  async refresh() {
    try {
      if (!this.songSummary) return;

      this.song = await this.songService.getSong(this.songSummary);
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
/*
  parse(lines: string[]) : Song
  {
    //var maxLines = 70;
    
    let maxLines = (window.innerHeight -50) / 13;
    var parsed: Song = new Song();

  	var isheader = true;
  	var header = [];
  	var blocks: Block[] = [];
 
  	var currentBlock = new Block();
  	blocks.push(currentBlock);

  	var idx = 0;
  	while (idx < lines.length && !(lines[idx].indexOf("@quit") ===0)) {
  		var line = lines[idx];
  	   if (line && line.trim) {
         //trim line to the right
         line = line.replace(/~+$/, '');
       }

  		if (isheader) {
  			if (line.indexOf("---") === 0) {
  				isheader = false;
  			} else {
  				header.push(line);
  			}
  		} else {
  			var br = line.indexOf("@br") > -1;
  			if (br || currentBlock.lines.length > maxLines) {
  				currentBlock = new Block();
  				blocks.push(currentBlock);
  			}
  			if (!br) currentBlock.lines.push(line);
  		}
  		idx++;
  	}
  	parsed.header = header;
    parsed.blocks = blocks;
    parsed.summary = this.songSummary;

  	return parsed;
  }
*/

  print() {
    this.onPrint.emit(this.song);
    //window.print();
  }
}

