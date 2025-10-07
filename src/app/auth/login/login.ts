import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  loginForm: FormGroup;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response: { userId: string; success: boolean }) => {
          if (response.success) {
            const userId = response.userId;
            this.authService.getDefaultProfile(userId).subscribe({
              next: (profileRes: { defaultProfile?: string }) => {
                if (profileRes && profileRes.defaultProfile) {
                  this.router.navigate(['/home']);
                } else {
                  // Open profile selection modal
                }
              }
            });
          }
        },
        error: () => {
          this.errorMessage = 'Invalid credentials';
        }
      });
    }
  }

  onSSOLogin() {
    console.log('SSO Login clicked');
  }
}