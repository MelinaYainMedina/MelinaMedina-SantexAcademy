import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  players: any[] = [];
  total = 0;
  page = 1;
  limit = 10;
  name = '';
  club = '';
  position = '';
  cargando = false;

  constructor(
    public http: HttpClient,
    public authService: AuthService,
    public router: Router
  ) {}

  

  ngOnInit() {
    this.cargarJugadores();
  }

  getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.obtenerToken()}`
    });
  }

  cargarJugadores() {
    this.cargando = true;
    let url = `http://localhost:3000/api/players?page=${this.page}&limit=${this.limit}`;
    if (this.name) url += `&name=${this.name}`;
    if (this.club) url += `&club=${this.club}`;
    if (this.position) url += `&position=${this.position}`;

    this.http.get<any>(url, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.players = res.data;
        this.total = res.total;
        this.cargando = false;
      },
      error: () => {
        this.authService.logout();
      }
    });
  }

  filtrar() {
    this.page = 1;
    this.cargarJugadores();
  }

  paginaAnterior() {
    if (this.page > 1) {
      this.page--;
      this.cargarJugadores();
    }
  }

  paginaSiguiente() {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.cargarJugadores();
    }
  }

  verDetalle(id: number) {
    this.router.navigate(['/players', id]);
  }

  descargarCSV() {
    if (!this.players.length) return;
    const headers = ['ID', 'Nombre', 'Club', 'Posición', 'Nacionalidad', 'Rating'];
    const rows = this.players.map(p => [
      p.id, p.name, p.club, p.position, p.nationality, p.rating
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jugadores.csv';
    a.click();
  }

  logout() {
    this.authService.logout();
  }

  get totalPaginas() {
    return Math.ceil(this.total / this.limit);
  }
 

}