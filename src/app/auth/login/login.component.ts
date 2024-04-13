import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { LoginUser } from './models/login-user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // Dependencies Injection
  #formBuilder: FormBuilder = inject(FormBuilder);
  #authService: AuthService = inject(AuthService);
  #router: Router = inject(Router);

  public loginForm: FormGroup = this.#formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public login() {
    if (this.loginForm.invalid) {
      return;
    }

    Swal.fire({
      title: 'Autenticando',
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const loginUser: LoginUser = this.loginForm.value as LoginUser;

    this.#authService
      .signIn(loginUser)
      .then((credentials) => {
        console.log(credentials);
        Swal.close();
        this.#router.navigate(['/dashboard']);
      })
      .catch((err) => {
        console.log({ err });
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
      });
  }
}
