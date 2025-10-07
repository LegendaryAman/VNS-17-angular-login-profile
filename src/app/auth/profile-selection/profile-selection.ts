import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';

@Component({
  selector: 'app-profile-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-selection.html',
  styleUrls: ['./profile-selection.scss']
})
export class ProfileSelectionComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  profiles = ['Admin', 'Institute Admin', 'Instructor', 'Student'];
  selectedProfile: string | null = null;

  selectProfile(profile: string) {
    this.selectedProfile = profile;
  }

  confirmSelection() {
    if (this.selectedProfile) {
      this.authService.saveDefaultProfile('123', this.selectedProfile).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error: unknown) => {
          console.error('Error saving profile:', error);
        }
      });
    }
  }
}