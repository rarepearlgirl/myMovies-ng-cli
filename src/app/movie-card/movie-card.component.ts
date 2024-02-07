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
      return this.movies;
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: genre.name,
        content: genre.Description,
      },
    });
  }
  openDirectorDialog(director: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: director.name,
        content: director.bio,
      },
    });
  }

  openInfoDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: 'Info',
        content: movie.description,
      },
    });
  }

  /**
   *
   * @param favMovieId
   * @returns a boolean, if the following movie is in the users favorite list or not
   */
  isFavorite(favMovieId: string): boolean {
    return this.fetchApiData.isFavoriteMovie(favMovieId);
  }

  /**
   * add a movie to users favorite list
   * @param favMovieId
   */
  addFavMovie(favMovieId: string): void {
    this.fetchApiData.addFavoriteMovie(favMovieId).subscribe(() => {
      

      this.snackBar.open('added to favorites', 'OK', { duration: 2000 });
      
    });
  }

  /**
   * removes a movie from the users favorite list
   * @param favMovieId
   */
  deleteFavMovie(favMovieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(favMovieId).subscribe(() => {
      this.snackBar.open('removed movie from favorites', 'OK', {
        duration: 2000,
      });
    });
  }
}