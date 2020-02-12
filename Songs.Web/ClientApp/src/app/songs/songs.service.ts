import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';
export  { Zoom } from './zoom';

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

  songs: SongSummary[];
  song: SongSummary;

  getSongs(): Promise<SongSummary[]> {

    let o = this.httpClient.get<SongSummary[]>(this.url('songs'))
    .pipe(
      tap(r => this.songs = r)
    );

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

  filterSongs(term: string, max = 15): SongSummary[] {
    if (term.length < 1)
      return this.songs;

    if (term.length === 1)
      return this.songs.filter(v => v.title.toLowerCase().startsWith(term)).slice(0, max);

    let starts = this.songs.filter(v => v.title.toLowerCase().startsWith(term));
    let not = this.songs.filter(v => !v.title.toLowerCase().startsWith(term) && SongsService.matchesToken(v, term));
    let songs = starts.concat(not);
    //console.log('starts', starts.length, 'not', not.length, 'songst', songs.length, 'this', this.songs.length);
    //this.songs.filter(song => SongsService.matchesToken(song, term))
    return songs.slice(0, max);
  }

  static matchesToken(s: SongSummary, t: string): boolean {
    if (s.title.toLowerCase().indexOf(t) > -1) return true;

    let found = s.searchTokens.find(tkn => tkn.toLowerCase().indexOf(t) > -1);
    return !!found;
  }

  onSongSelected: EventEmitter<SongSummary> = new EventEmitter<SongSummary>()
  
  private localKey: string = 'lastSong';

  selectSong(song: SongSummary = undefined) {
    
    if (!song) {
      let file = localStorage.getItem(this.localKey);

      if (this.songs.length) {
        let ls = this.songs.find(sng => sng.file === file);
        song = ls || this.songs[0];
      }
    }
    this.song = song;
    localStorage.setItem(this.localKey, song.file);
    this.onSongSelected.emit(song);

  }


}
  

export class SongSummary {
  title?: string;
  artist?: string;
  bpm?: string;
  note?: string;
  file?: string;
  searchTokens?: string[];
};


export class Song {

  summary: SongSummary;
  get header(): string[] {
    let s = this.summary;
    if (s == null) 
      return this.parsedHeader;

    let rv = [];
    let line = `${s.artist || ''} ${s.bpm || ''} ${s.note || ''}`.trim();
    if (!line.length)
      return this.parsedHeader;
      
    rv.push(line);
    return rv;
  }

  blocks: Block[] = [];

  lines: string[];
  private parsedHeader: string[];

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
  	this.parsedHeader = header;
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