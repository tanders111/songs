import { Injectable, EventEmitter, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
export  { Zoom } from './zoom';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor
    (
    private httpClient: HttpClient,
    private injector: Injector
    ) { }


  private root = "api";

  url(path: string) {
    return `${this.root}/${path}`;
  }

  songs: SongSummary[] = [];
  song: SongSummary;


  getSongs(): Promise<SongSummary[]> {

    //loaded at startup
    // if (this.songs) {
    //   return of(this.songs).toPromise();
    // }

    let o = this.httpClient.get<SongSummary[]>(this.url('songs'))
    .pipe(
      tap(r => this.songs = r)
    );

    return o.toPromise();
  }

  songCache: {[file: string]: Observable<Song> } = {};

  getSongByFile(file: string): Promise<Song> {

    file = file || localStorage.getItem(this.localKey);//this.songs[0].file;

    let url = this.url(`songs/${file}`);

    let o = this.songCache[file];

    if (!o) {
      o = this.httpClient.get<Song>(url).pipe(
        map(r => {
          let song = new Song();
          song.lines = r.lines;
          song.summary = this.songs ? this.songs.find(s => s.file === file) : undefined;
          song.parse()
          return song;
        })
      );

      this.songCache[file] = o;
    }

    return o.toPromise();
  }

  filterSongs(term: string, max = 15): SongSummary[] {
    if (term.length < 1)
      return this.songs;

    term = term.toLowerCase();
    
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

  private localKey: string = 'lastSong';

  selectSong(summary: SongSummary = undefined) {

    if (!summary) {

      let file = localStorage.getItem(this.localKey);

      if (file) {
        summary = this.songs.find(sng => sng.file === file);
      }
        summary = summary || this.songs[0];
    }

    this.song = summary;
    localStorage.setItem(this.localKey, summary.file);
    let router = this.injector.get(Router);
    router.navigate(['/songs', summary.file]);
  }


  load() {

    let file = localStorage.getItem(this.localKey);

    return new Promise((resolve, reject) => {

      this.getSongs()
        .then(r => {
          
          if (!file && r && r.length) {
            file = r[0].file;
            localStorage.setItem(this.localKey, file);
          }
          if (file) {
            resolve(r);
          } else {
            reject('no songs!');
          }
          
        })
        .catch(e => {
          console.error('rejected load', e);
          reject(e);
        })
      

    });
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