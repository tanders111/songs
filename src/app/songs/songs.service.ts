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

  //public static port = '3001';

  private get root() {
    let host = window.location.host;
    //let port = window.location.port;

    let port = '3001';

    if (host.indexOf('4200') > 0) 
      port = '3002';

    host = host.replace('4200', port);

    //port = port === '4200' ? '3002' : '3001';

    return `http://${host}/api`
  };

  url(path: string) {
    return `${this.root}/${path}`;
  }

  getSongs(): Promise<SongSummary[]> {

    let o = this.httpClient.get<SongSummary[]>(this.url('songs'));

    return o.toPromise();

  }

  getSong(file: string): Promise<any> {

    let o = this.httpClient.get<any>(this.url(`songs/${file}`));

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

}

export class Block {
  lines: string[] = [];
}