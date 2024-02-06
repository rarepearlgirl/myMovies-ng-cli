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
    this.getFavMovies();

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
    this.fetchApiData.editUser(this.userData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));

      this.user = result;
      this.snackBar.open('profile updated successfully', 'OK', {
        duration: 2000,
      });
    });
  }

  getFavMovies(): void {

    this.fetchApiData.getAllMovies().subscribe((movies) => {
      this.favoriteMovies = movies.filter((movie: any) => {
        return this.user.favoriteMovies?.includes(movie._id);
      });});

  }
  deleteFavoriteMovie(favMovie: string): void {
    this.fetchApiData.deleteFavoriteMovie(favMovie).subscribe((movie) => {
      this.favoriteMovies = this.favoriteMovies.filter((movie: any) => {
        return movie._id !== favMovie;
      });});
  }
}