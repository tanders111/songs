import { Song } from './songs.service';

export class Zoom {

    dim: number;
    compact: boolean;

    constructor(
      private song: Song, 
      private printing: boolean = true) 
    { 
      this.dim = window.innerWidth * window.innerHeight;
      this.compact = this.dim < 300000; 
      console.log(`*****compact ${this.compact}  h=${window.innerHeight} w=${window.innerWidth} d=${this.dim}`);
      if (this.compact) {
        this.zoom = this.min;
        this.fontClass=[`font-${this.zoom}`];
      }

    }
  
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