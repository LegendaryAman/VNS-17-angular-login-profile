import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  forgotPasswordForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      // Placeholder API call
      this.authService.requestPasswordReset(email).subscribe({
        next: () => {
          this.successMessage = 'Password reset link sent to your email.';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2000); // Redirect after 2s
        },
        error: () => {
          this.errorMessage = 'Error sending reset link. Please try again.';
          this.successMessage = '';
        }
      });
    }
  }

  goBackToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}