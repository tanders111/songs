import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavGuard } from './songs/nav-guard';
import { SongPrintComponent } from './songs/song-print.component';
import { SongComponent } from './songs/song.component';

const routes: Routes = [

  // { path: '', component: SongComponent }.
  { path: '',  component: SongComponent, pathMatch: 'full' },
  { path: 'songs/:file', component: SongComponent, pathMatch: 'full', canDeactivate: [NavGuard] },
  { path: 'print/:file', component: SongPrintComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [NavGuard]
})
export class AppRoutingModule { }
