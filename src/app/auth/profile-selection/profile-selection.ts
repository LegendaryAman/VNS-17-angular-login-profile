import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  selectedDefault: string | null = null;
  userId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userId: string }) {
    this.userId = data.userId;
  }

  selectProfile(profile: string) {
    this.selectedProfile = profile;
    this.selectedDefault = this.selectedDefault === profile ? null : profile;
  }

  confirmSelection() {
    if (this.selectedProfile) {
      this.authService.saveDefaultProfile(this.userId, this.selectedProfile).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error: unknown) => {
          console.error('Error saving profile:', error);
        }
      });
    }
  }

  isDefault(profile: string): boolean {
    return this.selectedDefault === profile;
  }
}