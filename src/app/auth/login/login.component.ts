import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../services/auth.service';
import { LoginUser } from './models/login-user.interface';
import { AppState } from '../../app.state';
import * as uiActions from '../../shared/state/ui.actions';
import { uiFeature } from '../../shared/state/ui.state';

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
  #store: Store<AppState> = inject(Store);

  public loading: boolean = false;
  // public loading$: Observable<boolean> = this.#store.select('ui');

  constructor() {
    this.#store
      .select(uiFeature.selectUiState)
      .pipe(takeUntilDestroyed())
      .subscribe((ui) => {
        console.log('cargango subs', { ui });
        this.loading = ui.loading;
      });
  }

  public loginForm: FormGroup = this.#formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.#store.dispatch(uiActions.loading());

    // Swal.fire({
    //   title: 'Autenticando',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const loginUser: LoginUser = this.loginForm.value as LoginUser;

    this.#authService
      .signIn(loginUser)
      .then((credentials) => {
        console.log(credentials);
        // Swal.close();
        this.#router.navigate(['/dashboard']);
        this.#store.dispatch(uiActions.stopLoading());
      })
      .catch((err) => {
        this.#store.dispatch(uiActions.stopLoading());
        console.log({ err });
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
      });
  }
}
