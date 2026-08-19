import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm!: FormGroup;

  showPassword = false;
  isLoading = false;


  constructor(private fb: FormBuilder){

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]

      ]

    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    setTimeout(()=>{
      this.isLoading = false;
      console.log(this.loginForm.value)
    },1500);
  }


}
