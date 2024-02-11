// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  constructor(
    private fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log('FavoriteMovies Response:', resp);
      return this.movies;
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: genre.Name,
        content: genre.Description,
      },
    });
  }
  openDirectorDialog(director: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: director.Name,
        content: director.Bio,
      },
    });
  }

  openInfoDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: 'Description',
        content: movie.Description,
      },
    });
  }

  /**
   *
   * @param favMovieId
   * @returns a boolean, if the following movie is in the users favorite list or not
   */
  isFavorite(FavoriteMovieId: string): boolean {
    return this.fetchApiData.isFavoriteMovie(FavoriteMovieId);
  }

  /**
   * add a movie to users favorite list
   * @param favMovieId
   */
  addFavoriteMovie(FavoriteMovieId: string): void {
    this.fetchApiData.addFavoriteMovie(FavoriteMovieId).subscribe(() => {
       console.log('addfavoriteMovieId called');

      this.snackBar.open('added to favorites', 'OK', { duration: 2000 });
      
    });
  }

  /**
   * removes a movie from the users favorite list
   * @param favMovieId
   */
  deleteFavoriteMovie(FavoriteMovieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(FavoriteMovieId).subscribe(() => {
      this.snackBar.open('removed movie from favorites', 'OK', {
        duration: 2000,
      });
    });
  }
}