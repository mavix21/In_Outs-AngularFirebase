import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../services/auth.service';
import { RegisterUser } from './models/register-user.interface';
import * as uiActions from '../../shared/state/ui.actions';
import { uiFeature } from '../../shared/state/ui.state';
import { AppState } from '../../app.state';

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
  #store: Store<AppState> = inject(Store);

  public loading: boolean = false;

  constructor() {
    this.#store
      .select(uiFeature.selectUiState)
      .pipe(takeUntilDestroyed())
      .subscribe((ui) => {
        console.log('cargango subs', { ui });
        this.loading = ui.loading;
      });
  }

  public registerForm: FormGroup = this.#formBuilder.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public register(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.#store.dispatch(uiActions.loading());

    // Swal.fire({
    //   title: 'Autenticando',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const { email, username, password } = this.registerForm
      .value as RegisterUser;

    this.#authService
      .createUser({ email, username, password })
      .then(async ({ user: { email, uid } }) => {
        await this.#authService.addUserProfile({ email, username, uid });
        this.#store.dispatch(uiActions.stopLoading());
        // Swal.close();
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
