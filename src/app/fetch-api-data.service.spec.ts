import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpHeaders,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movie-mania-777.netlify.app/';
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  //
  public userLogin(username: string, password: string): Observable<any> {
    return this.http
      .post(apiUrl + 'login', { username, password })
      .pipe(catchError(this.handleError));
  }


  public getAllMovies(): Observable<any> {
    if (typeof window === 'undefined') {
      return new Observable<any>();
    }

    console.log('getallmovies called');
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //
  public getOneMovies(movie: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + 'movies/' + movie, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //
  public getDirector(director: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + director, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //
  public getGenre(genre: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + genre, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //
  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Response>(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //

  //
  public addFavMovie(favMovieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.favoriteMovies.push(favMovieId);
    localStorage.setItem('user', JSON.stringify(user));

    return this.http
      .post<Response>(
        apiUrl + 'users/' + user.username + '/movies/' + favMovieId,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public deleteFavMovie(favMovieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const index = user.favoriteMovies.indexOf(favMovieId);

    if (index > -1) {
      user.favoriteMovies.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));

    return this.http
      .delete<Response>(
        apiUrl + 'users/' + user.username + '/movies/' + favMovieId,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public isFavMovies(favMovieId: string): Observable<boolean> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      return of(user.favoriteMovies.includes(favMovieId));
    } else {
      return of(false);
    }
  }

  //test
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const token = localStorage.getItem('token');
    return this.http
      .put<Response>(apiUrl + 'users/' + user.username, updatedUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //
  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete<Response>(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //

  // Non-typed response extraction
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }

  //
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
          `Error body is: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}