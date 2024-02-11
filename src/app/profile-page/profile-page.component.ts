import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

type User = {
  _id?: string;
  username?: string;
  password?: string;
  email?: string;
  favoriteMovies?: any[];
};

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  user: User = {};
  favoriteMovies: any[] = [];

  @Input() userData = { username: '', password: '', email: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.getUser();
    // this.getFavoriteMovies();
    this.favoriteMovies = this.getFavoriteMovies() as unknown as any[];

    if (!user._id) {
      this.router.navigate(['welcome']);
      return;
    }

    this.user = user;

    this.userData = {
      username: user.username || '',
      password: '',
      email: user.email || '',
    };
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
    
  }
  updateUser(): void {
    this.fetchApiData.editUser({Name: this.userData.username, Password: this.userData.password, Email: this.userData.email}).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));

      this.user = result;
      this.snackBar.open('profile updated successfully', 'OK', {
        duration: 2000,
      });
    });
  }

deleteUser(): void {
  this.fetchApiData.deleteUser().subscribe(() => {
      localStorage.removeItem('user');
      this.snackBar.open('profile deleted successfully', 'OK', {
        duration: 2000,
      });
    });
  }

  getFavoriteMovies(): void {

    this.fetchApiData.getFavoriteMovies().subscribe((movies) => {
      if(!movies || !movies.favoriteMovies) {
        return []
      }
      this.favoriteMovies = movies.favoriteMovies
      return movies.favoriteMovies
    });
  }

  deleteFavoriteMovie(favoriteMovie: string): void {
    this.fetchApiData.deleteFavoriteMovie(favoriteMovie).subscribe((movie) => {
      this.favoriteMovies = this.favoriteMovies.filter((movie: any) => {
        return movie._id !== favoriteMovie;
      });});
  }
}