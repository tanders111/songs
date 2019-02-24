import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor
    (
      private httpClient: HttpClient
    ) { }


  private root = "api";

  private getRootTheOldWay() : string {
    let host = window.location.host;

    let port = '3001';

    if (host.indexOf('4200') > 0) 
      port = '3002';

    host = host.replace('4200', port);

    return `http://${host}/api`;
  }

  url(path: string) {
    return `${this.root}/${path}`;
  }

  getSongs(): Promise<SongSummary[]> {

    let o = this.httpClient.get<SongSummary[]>(this.url('songs'));

    return o.toPromise();

  }

  getSong(summary: SongSummary): Promise<Song> {

    let url = this.url(`songs/${summary.file}`);

    let o = this.httpClient.get<Song>(url).pipe(
      map(r => {
        let song = new Song();
        song.lines = r.lines;
        song.summary = summary;
        song.parse()
        return song;
      })
     );

    return o.toPromise();
  }
}
  

export class SongSummary {
  title?: string;
  artist?: string;
  file?: string;
  searchTokens?: string[];
};


export class Song {

  summary: SongSummary;
  header: string[] = [];
  blocks: Block[] = [];

  lines: string[];

  parse(maxLines: number = undefined) : Song
  {
    let lines = this.lines;
    maxLines = maxLines || (window.innerHeight - 100) / 25;
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
        if  (br) line = '';//don't need manual breaks anymore
  			if (currentBlock.lines.length > maxLines) {
  				currentBlock = new Block();
  				blocks.push(currentBlock);
  			}
  			if (!br) currentBlock.lines.push(line);
  		}
  		idx++;
  	}
  	this.header = header;
    this.blocks = blocks;

  	return parsed;
  }
}

export class Block {
  lines: string[] = [];

  get text() : string {
    return this.lines.join('\n');
  }
}

export class SongLines
 { 
   lines: string[]
   name: string
 };

 export class Zoom {

  constructor(
    private song: Song, 
    private printing: boolean = true) 
  { }

  zoom: number = 100;
  max: number = 200;
  min: number = 60;
  fontClass: string[] = ['font-100'];

  in() {
    if (this.zoom + 20 <= this.max) {
      this.zoom += 20;
      this.fontClass = [`font-${this.zoom}`];
    }
    this.parse();
  }

  out() {
    if (this.zoom - 20 >= this.min) {
      this.zoom -= 20;
      this.fontClass = [`font-${this.zoom}`];
    }
    this.parse();
  }

  parse() {

    let linesPerPage = 58;

    let zoom = this.zoom;
    if (this.printing) { 

      if (zoom === 60) linesPerPage =  90;
      if (zoom === 80) linesPerPage =  80;
      if (zoom === 100) linesPerPage = 60;
      if (zoom === 120) linesPerPage = 50;
      if (zoom === 140) linesPerPage = 40;
      if (zoom === 160) linesPerPage = 40;
      if (zoom === 180) linesPerPage = 30;
      if (zoom === 200) linesPerPage = 20;
    } else {
      linesPerPage = this.calcLines();
    }
    this.song.parse(linesPerPage);
  }

  private calcLines() : number {
     let height = window.innerHeight - 130;  //pixels height of song frame

     let zoom = this.zoom;
     let linesPerPage = 50;

     if (zoom === 60) linesPerPage = height * 0.0732323232323232;
     if (zoom === 80) linesPerPage = height * 0.0542929292929293;
     if (zoom === 100) linesPerPage = height * 0.0429292929292929;
     if (zoom === 120) linesPerPage = height * 0.0366161616161616;
     if (zoom === 140) linesPerPage = height * 0.0315656565656566;
     if (zoom === 160) linesPerPage = height * 0.0265151515151515;
     if (zoom === 180) linesPerPage = height * 0.023989898989899;
     if (zoom === 200) linesPerPage = height * 0.0214646464646465;
     
     return linesPerPage;
  }
}