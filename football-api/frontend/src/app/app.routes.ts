import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PlayersComponent } from './players/players.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { PlayerEditComponent } from './player-edit/player-edit.component';
import { PlayerCreateComponent } from './player-create/player-create.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'players/new', component: PlayerCreateComponent, canActivate: [AuthGuard] },
  { path: 'players', component: PlayersComponent, canActivate: [AuthGuard] },
  { path: 'players/:id', component: PlayerDetailComponent, canActivate: [AuthGuard] },
  { path: 'players/:id/edit', component: PlayerEditComponent, canActivate: [AuthGuard] },
];