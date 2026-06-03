import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-player-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-create.component.html',
  styleUrls: ['./player-create.component.css']
})
export class PlayerCreateComponent {
  form: FormGroup;
  guardando = false;
  exito = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      club: ['', Validators.required],
      nationality: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      speed: ['', [Validators.min(0), Validators.max(99)]],
      shooting: ['', [Validators.min(0), Validators.max(99)]],
      passing: ['', [Validators.min(0), Validators.max(99)]],
      dribbling: ['', [Validators.min(0), Validators.max(99)]],
      defending: ['', [Validators.min(0), Validators.max(99)]],
      physic: ['', [Validators.min(0), Validators.max(99)]],
    });
  }

  getHeaders() {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.obtenerToken()}` });
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;
    this.http.post<any>('http://localhost:3000/api/players', this.form.value, {
      headers: this.getHeaders()
    }).subscribe({
      next: (player) => {
        this.exito = true;
        this.guardando = false;
        setTimeout(() => this.router.navigate(['/players', player.id]), 1500);
      },
      error: () => {
        this.error = 'Error al crear el jugador';
        this.guardando = false;
      }
    });
  }

  volver() {
    this.router.navigate(['/players']);
  }
}