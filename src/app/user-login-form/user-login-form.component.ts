// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss',
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { username: '', password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  /**
   *  This is the function responsible for sending the form inputs to the backend
   */
  loginUser(): void {
    console.log('Login');
    this.fetchApiData
      .userLogin({ username: this.userData.username, password: this.userData.password })

      .subscribe(
        (result) => {
          console.log('result:', JSON.stringify(result));
          //TEST, STILL NEEDS CONFIRMATION THAT OT WORKS
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);

          this.dialogRef.close(); 
          this.snackBar.open('user logged in', 'OK', {
            duration: 2000,
          });

          this.router.navigate(['movies']);
        },
        (result) => {
          this.snackBar.open(result, 'OK', {
            duration: 2000,
          });
        }
      );
  }
}