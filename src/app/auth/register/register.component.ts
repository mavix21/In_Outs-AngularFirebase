import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterUser } from './models/register-user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  // Dependencies Injection
  #formBuilder: FormBuilder = inject(FormBuilder);
  #authService: AuthService = inject(AuthService);
  #router: Router = inject(Router);

  public registerForm: FormGroup = this.#formBuilder.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public register(): void {
    if (this.registerForm.invalid) {
      return;
    }

    Swal.fire({
      title: 'Autenticando',
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const { email, username, password } = this.registerForm
      .value as RegisterUser;

    this.#authService
      .createUser({ email, username, password })
      .then(async ({ user: { email, uid } }) => {
        await this.#authService.addUserProfile({ email, username, uid });
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
