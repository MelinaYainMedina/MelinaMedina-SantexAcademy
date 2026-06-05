import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit {
  player: any = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(`http://localhost:3000/api/players/${id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.obtenerToken()}`
      })
    }).subscribe({
      next: (res) => {
        this.player = res;
        this.cargando = false;
        setTimeout(() => this.dibujarRadar(), 100);
      },
      error: () => this.authService.logout()
    });
  }

  dibujarRadar() {
    const canvas = document.getElementById('radarChart') as HTMLCanvasElement;
    if (!canvas || !this.player) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const skills = [
      { label: 'Velocidad', value: this.player.speed || 0 },
      { label: 'Disparo', value: this.player.shooting || 0 },
      { label: 'Pase', value: this.player.passing || 0 },
      { label: 'Dribbling', value: this.player.dribbling || 0 },
      { label: 'Defensa', value: this.player.defending || 0 },
      { label: 'Físico', value: this.player.physic || 0 },
    ];

    const size = 300;
    const center = size / 2;
    const radius = 110;
    const sides = skills.length;
    const angleStep = (Math.PI * 2) / sides;

    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    // Fondo del radar (círculos)
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      for (let j = 0; j < sides; j++) {
        const angle = j * angleStep - Math.PI / 2;
        const r = (radius * i) / 5;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Líneas desde el centro
    for (let j = 0; j < sides; j++) {
      const angle = j * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(center + radius * Math.cos(angle), center + radius * Math.sin(angle));
      ctx.strokeStyle = '#ddd';
      ctx.stroke();
    }

    // Área de skills
    ctx.beginPath();
    skills.forEach((skill, j) => {
      const angle = j * angleStep - Math.PI / 2;
      const r = (radius * skill.value) / 100;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(15, 52, 96, 0.4)';
    ctx.fill();
    ctx.strokeStyle = '#0f3460';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    skills.forEach((skill, j) => {
      const angle = j * angleStep - Math.PI / 2;
      const x = center + (radius + 20) * Math.cos(angle);
      const y = center + (radius + 20) * Math.sin(angle);
      ctx.fillText(`${skill.label} (${skill.value})`, x, y);
    });
  }

  volver() {
    this.router.navigate(['/players']);
  }

  editar() {
  this.router.navigate(['/players', this.player.id, 'edit']);
}

verHistorial() {
  this.router.navigate(['/players', this.player.id, 'history']);
}


}