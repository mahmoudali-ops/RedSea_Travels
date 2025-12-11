import { CommonModule, NgClass } from '@angular/common';
import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule, NgClass, RouterLink]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  IsSccuess = false;
  serverError: string = '';
  returnUrl: string = '/admin/tours';

  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly toasterService = inject(ToastrService);

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // الحصول على returnUrl من query params
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/admin/tours';
  }

  onSubmit(): void {
    this.submitted = true;
    this.serverError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = this.loginForm.value;

    this.authService.Login(loginData).subscribe({
      next: (res: any) => {
        this.IsSccuess = true;

        // اظهار alert للنجاح
        this.toasterService.success('Login valid!', 'Success');

        setTimeout(() => {
          // redirect بعد نجاح login حسب returnUrl
          this._router.navigateByUrl(this.returnUrl);
        }, 500);
      },
      error: (err) => {
        this.toasterService.error('Invalid email or password', 'Login Failed');
      }
    });
  }
}
