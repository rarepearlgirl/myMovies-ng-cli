import { Component, OnInit, Input } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { FetchApiDataService } from '../fetch-api-data.service';

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

  loginUser(): void {
    this.fetchApiData
      .userLogin({ Name: this.userData.username, Password: this.userData.password })

      .subscribe(
        (result) => {
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