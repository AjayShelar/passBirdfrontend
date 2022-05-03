import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { from ,of, Observable} from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import Amplify, { Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn: BehaviorSubject<boolean>;

  constructor(
    private router: Router
  ) {
    Amplify.configure(environment.amplify);
    this.loggedIn = new BehaviorSubject<boolean>(false);
  }

  /** get authenticat state */
  public isAuthenticated(): Observable<any> {
    return from(Auth.currentAuthenticatedUser())
      .pipe(
        map(result => {
          this.loggedIn.next(true);
          return true;
        }),
        catchError(error => {
          this.loggedIn.next(false);
          return of(false);
        })
      );
  }
  /** signout */
  public signOut() {
    from(Auth.signOut())
    .pipe(
      map(result => {
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        this.loggedIn.next(false);
        return of(false);
      })
    );
     
  }
}
