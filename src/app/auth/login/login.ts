import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileSelectionComponent } from '../profile-selection/profile-selection';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, MatDialogModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  loginForm: FormGroup;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    console.log('Form initialized:', this.loginForm); // Debug log
  }

  onLogin() {
    console.log('Form submitted:', this.loginForm.value, 'Valid:', this.loginForm.valid); // Debug log
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response: { userId: string; success: boolean }) => {
          console.log('Login response received:', response); // Debug log
          if (response.success) {
            const userId = response.userId;
            this.authService.getDefaultProfile(userId).subscribe({
              next: (profileRes: { defaultProfile?: string | null }) => {
                console.log('Profile response:', profileRes); // Debug log
                if (profileRes && profileRes.defaultProfile !== null) {
                  this.router.navigate(['/home']);
                } else {
                  this.dialog.open(ProfileSelectionComponent, {
                    width: '300px',
                    data: { userId }
                  });
                }
              }
            });
          } else {
            this.errorMessage = 'Invalid credentials';
          }
        },
        error: () => {
          this.errorMessage = 'Invalid credentials';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all fields with valid data.';
    }
  }

  onSSOLogin() {
    console.log('SSO Login initiated');
    this.authService.ssoLogin().subscribe({
      next: (response: { userId: string; success: boolean }) => {
        if (response.success) {
          const userId = response.userId;
          this.authService.getDefaultProfile(userId).subscribe({
            next: (profileRes: { defaultProfile?: string | null }) => {
              if (profileRes && profileRes.defaultProfile !== null) {
                this.router.navigate(['/home']);
              } else {
                this.dialog.open(ProfileSelectionComponent, {
                  width: '300px',
                  data: { userId }
                });
              }
            }
          });
        } else {
          this.errorMessage = 'SSO authentication failed';
        }
      },
      error: () => {
        this.errorMessage = 'SSO authentication error';
      }
    });
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    console.log('Forgot Password clicked');
    this.router.navigate(['/forgot-password']);
  }
}