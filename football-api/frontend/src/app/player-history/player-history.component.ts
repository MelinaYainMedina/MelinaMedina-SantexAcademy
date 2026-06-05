import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-player-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-history.component.html',
  styleUrls: ['./player-history.component.css']
})
export class PlayerHistoryComponent implements OnInit {
  player: any = null;
  history: any[] = [];
  skillSeleccionada = 'pace';
  cargando = true;
  analisis = '';
  cargandoAnalisis = false;
  playerId!: number;

  skills = [
    { key: 'pace', label: 'Velocidad' },
    { key: 'shooting', label: 'Disparo' },
    { key: 'passing', label: 'Pase' },
    { key: 'dribbling', label: 'Dribbling' },
    { key: 'defending', label: 'Defensa' },
    { key: 'physic', label: 'Físico' },
    { key: 'overall', label: 'Rating general' },
  ];

  private token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.playerId = +this.route.snapshot.paramMap.get('id')!;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    this.http.get<any>(`http://localhost:3000/api/players/${this.playerId}`, { headers })
      .subscribe(p => {
        this.player = p;
        this.http.get<any[]>(`http://localhost:3000/api/players/${this.playerId}/history`, { headers })
          .subscribe(h => {
            this.history = h;
            this.cargando = false;
            setTimeout(() => this.dibujarGrafico(), 100);
          });
      });
  }

  cambiarSkill(skill: string) {
    this.skillSeleccionada = skill;
    setTimeout(() => this.dibujarGrafico(), 50);
  }

  dibujarGrafico() {
    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!canvas || !this.history.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth || 600;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const valores = this.history.map(h => h[this.skillSeleccionada] ?? 0);
    const minVal = Math.max(0, Math.min(...valores) - 10);
    const maxVal = Math.min(99, Math.max(...valores) + 10);

    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.stroke();
      const val = Math.round(maxVal - ((maxVal - minVal) * i) / 5);
      ctx.fillStyle = '#888';
      ctx.font = '11px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(String(val), padding.left - 5, y + 4);
    }

    ctx.beginPath();
    this.history.forEach((h, i) => {
      const x = padding.left + (i / (this.history.length - 1)) * chartW;
      const val = h[this.skillSeleccionada] ?? 0;
      const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(15, 52, 96, 0.15)';
    ctx.fill();

    ctx.beginPath();
    this.history.forEach((h, i) => {
      const x = padding.left + (i / (this.history.length - 1)) * chartW;
      const val = h[this.skillSeleccionada] ?? 0;
      const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#0f3460';
    ctx.lineWidth = 3;
    ctx.stroke();

    this.history.forEach((h, i) => {
      const x = padding.left + (i / (this.history.length - 1)) * chartW;
      const val = h[this.skillSeleccionada] ?? 0;
      const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#e94560';
      ctx.fill();

      ctx.fillStyle = '#0f3460';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(String(val), x, y - 12);
    });

    this.history.forEach((h, i) => {
      const x = padding.left + (i / (this.history.length - 1)) * chartW;
      ctx.fillStyle = '#555';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`FIFA ${h.year}`, x, height - 10);
    });
  }
  analizarConIA() {
  this.cargandoAnalisis = true;
  this.analisis = '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
  });
  this.http.get<any>(`http://localhost:3000/api/players/${this.playerId}/analysis`, { headers })
    .subscribe({
      next: (res) => {
        this.analisis = res.analysis;
        this.cargandoAnalisis = false;
      },
      error: () => {
        this.analisis = 'Error al generar el análisis.';
        this.cargandoAnalisis = false;
      }
    });
}

  volver() {
    this.router.navigate(['/players', this.playerId]);
  }

  get skillLabel() {
    return this.skills.find(s => s.key === this.skillSeleccionada)?.label || '';
  }
}