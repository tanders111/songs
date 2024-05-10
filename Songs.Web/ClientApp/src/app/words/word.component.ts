import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { Observable, pipe } from 'rxjs';

import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';


@Component({
  selector: 'word',
  templateUrl: 'word.component.html'
})
export class WordComponent implements OnInit {


  status = new WordStatus();
 
  potential: string[] = [];

  correct: string[] = ['', '', '', '', '']

  constructor(private http: HttpClient, private router: Router) { }

  async ngOnInit() {
    // this.status = {
    //   correct: "spa--",
    //   hasNot: "inm",
    //   wrongPlace: ["", "", "", "k", ""]
    // }
  }

  async go() {

    this.potential = [];

    try {

      this.status.hasNot = this.status.hasNot?.trim().toUpperCase();
      this.status.correct = this.status.correct?.trim() ?? '';
      
      let cl = this.correct.map(c => c?.length && c.match(/[a-z]/i) ? c : '-');
      this.status.correct = cl.join('');

      if (this.status.correct.length != 5) {
        alert('correct needs to be 5 characters');
      }

      let r = await this.http.post<string[]>('app/word', this.status).toPromise();
      this.potential = r;
    } catch (e) {
      alert(JSON.stringify(e, null, 2));
      console.error('error getting words', e);
    }
  }

  async anagrams() {
    try {
      this.potential = await this.http.get<string[]>(`app/anagrams/${this.status.hasNot}`).toPromise();
    } catch (e) {
      console.error(e);
      alert(e.toString());
    }
  }

  async bee() {
    try {
      let required = this.correct[0];
      if (!required?.length) {
        alert('please enter rquired letter');
        return;
      }

      let parms = new HttpParams().append('required', required);

      this.potential = await this.http.get<string[]>(`app/bee/${this.status.hasNot}`, {params: parms}).toPromise();
    } catch (e) {
      console.error(e);
      alert(e.toString());
    }
  }

  reset() {
    this.potential = [];
    this.correct = ['', '', '', '', ''];
    this.status = new WordStatus();
  }
  
}

export class WordStatus {
  hasNot: string;
  correct: string;
  wrongPlace: string[] = ['', '', '', '', ''];
}
