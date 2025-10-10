import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { LoginComponent } from './login';
  import { ReactiveFormsModule } from '@angular/forms';
  import { RouterModule } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { MatDialogModule } from '@angular/material/dialog';
  import { AuthService } from '../../services/auth.service';
  import { of } from 'rxjs';

  describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
      const spy = jasmine.createSpyObj('AuthService', ['login', 'getDefaultProfile']);
      spy.login.and.returnValue(of({ userId: '123', success: true }));
      spy.getDefaultProfile.and.returnValue(of({ defaultProfile: null }));

      await TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, RouterModule.forRoot([]), CommonModule, MatDialogModule],
        providers: [{ provide: AuthService, useValue: spy }]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display error on invalid login', () => {
      component.loginForm.setValue({ email: '', password: '' });
      component.onLogin();
      fixture.detectChanges();
      expect(component.errorMessage).toBe('Invalid credentials');
    });

    it('should render logo and form', () => {
      const logo = fixture.nativeElement.querySelector('.login-logo');
      const form = fixture.nativeElement.querySelector('form');
      expect(logo).toBeTruthy();
      expect(form).toBeTruthy();
    });
  });