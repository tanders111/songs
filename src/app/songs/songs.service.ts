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
    maxLines = maxLines || (window.innerHeight -50) / 13;
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
  	this.header = header;
    this.blocks = blocks;

  	return parsed;
  }
}

export class Block {
  lines: string[] = [];
}

export class SongLines
 { 
   lines: string[]
   name: string
 };