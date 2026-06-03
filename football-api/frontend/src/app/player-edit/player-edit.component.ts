import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-player-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-edit.component.html',
  styleUrls: ['./player-edit.component.css']
})
export class PlayerEditComponent implements OnInit {
  form!: FormGroup;
  playerId!: number;
  cargando = true;
  guardando = false;
  exito = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.playerId = +this.route.snapshot.paramMap.get('id')!;
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

    this.http.get<any>(`http://localhost:3000/api/players/${this.playerId}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.obtenerToken()}` })
    }).subscribe({
      next: (player) => {
        this.form.patchValue(player);
        this.cargando = false;
      },
      error: () => this.authService.logout()
    });
  }

  getHeaders() {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.obtenerToken()}` });
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;
    this.http.patch(`http://localhost:3000/api/players/${this.playerId}`, this.form.value, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.exito = true;
        this.guardando = false;
        setTimeout(() => this.router.navigate(['/players', this.playerId]), 1500);
      },
      error: () => { this.guardando = false; }
    });
  }

  volver() {
    this.router.navigate(['/players', this.playerId]);
  }
}