import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


import { SongsService } from './app/songs/songs.service';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
 .catch(err => console.error(err));

  
//const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);