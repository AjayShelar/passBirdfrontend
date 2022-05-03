import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import Amplify, { Auth } from 'aws-amplify';
import { environment } from './../../environments/environment';
import { User } from 'angular-feather/icons';
import { TmplAstRecursiveVisitor } from '@angular/compiler';

@Injectable()
export class AuthService {

  public loggedIn: BehaviorSubject<boolean>;

  constructor(
    private router: Router
  ) {
    this.loggedIn = new BehaviorSubject<boolean>(false);



    fromPromise(Auth.currentAuthenticatedUser()).subscribe((
      user
    ) => {

      const currentSession = user.signInUserSession;
      user.refreshSession(currentSession.refreshToken, (err, session) => {

      });

    })
  }


  /** signup */
  public signUp(email, password): Observable<any> {
    return fromPromise(Auth.signUp(email, password));
  }

  /** confirm code */
  public confirmSignUp(email, code): Observable<any> {
    return fromPromise(Auth.confirmSignUp(email, code));
  }

  /** signup */
  public resendCode(email): Observable<any> {
    return fromPromise(Auth.resendSignUp(email));
  }

  /** signin */
  public signIn(email, password): Observable<any> {
    return fromPromise(Auth.signIn(email, password))
      .pipe(
        tap((user) => {
          this.loggedIn.next(true);
          localStorage.setItem('isLogged', 'true');
          fromPromise(Auth.currentAuthenticatedUser()).subscribe((
            user
          ) => {

            const currentSession = user.signInUserSession;
            user.refreshSession(currentSession.refreshToken, (err, session) => {

            });

          })

        }
        )
      );
  }

  /** get authenticat state */
  public getAuthenticatedUser(): Observable<any> {
    fromPromise(Auth.currentAuthenticatedUser()).subscribe((
      user
    ) => {

      const currentSession = user.signInUserSession;
      user.refreshSession(currentSession.refreshToken, (err, session) => {

      });

    })
    return fromPromise(Auth.currentAuthenticatedUser())
      .pipe(
        map(result => {
          return result;
        }),
        catchError(error => {
          return of(error);
        })
      );
  }

  public getCurrentSession(): Observable<any> {
    fromPromise(Auth.currentAuthenticatedUser()).subscribe((
      user
    ) => {
      const currentSession = user.signInUserSession;
      user.refreshSession(currentSession.refreshToken, (err, session) => {
        localStorage.setItem('loggedIn', JSON.stringify(true));

      });

    })

    return fromPromise(Auth.currentSession()).pipe(
      map(result => {
        return result;
      }),
      catchError(error => {
        return of(error);
      })
    );
  }


  /** get authenticat state */
  public isAuthenticated(): Observable<boolean> {

    return fromPromise(Auth.currentAuthenticatedUser())
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

  /** forgot password code request */
  public forgotPassword(username): Observable<any> {

    return fromPromise(Auth.forgotPassword(username));

  }
  /**sumbit forgot password */
  public forgotPasswordSubmit(email, code, password): Observable<any> {

    return fromPromise(Auth.forgotPasswordSubmit(
      email,
      code,
      password
    )
    );

  }

  /** signout */
  public signOut() {
    fromPromise(Auth.signOut())
      .subscribe(
        result => {

          this.loggedIn.next(false);
          localStorage.clear();
          this.router.navigate(['/login']);
        },
        error => console.error(error)
      );
  }
}