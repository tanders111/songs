

import { faBinoculars, faPrint, faSearchPlus, faSearchMinus, faTextHeight, faTextWidth, faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';


export class Icons {
  faBinoculars = faBinoculars;
  faPrint = faPrint;
  faSearchPlus = faSearchPlus;
  faSearchMinus = faSearchMinus;
  faTextHeight = faTextHeight;
  faTextWidth = faTextWidth;
  faSearch = faSearch;

  allIcons(): IconDefinition[] {
   
    let names = Object.getOwnPropertyNames(this);

    let defs = names.map(n => this[n]).filter(n => n);

    return defs;
  }

}
