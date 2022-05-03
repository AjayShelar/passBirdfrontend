import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  
	CognitoUserPool,
	CognitoUserAttribute,
  CognitoUser,
  
} from 'amazon-cognito-identity-js';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { ApiService } from 'src/app/api.service';


interface formDataInterface {
  "email": string;
  [key: string]: string;
};

export class SignUpField {
  label: string | undefined;
  key: string | undefined;
  required?: boolean;
  type?: string;
  displayOrder?: number;
  invalid?: boolean;
  custom?: boolean;
  signUpWith?: boolean;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  public successfullySignup: boolean | undefined;
  loading = false;
  @ViewChild('form') registerForm: HTMLFormElement | undefined;
  _authState: AuthState;
  _show: boolean | undefined;
  _signUpConfig: any;
  _usernameAttributes: string = 'username';
  user: any = {};
  local_phone_number: string | undefined;
  country_code: string = '1';
  header: string = 'Create a new account';
  defaultSignUpFields: SignUpField[] = defaultSignUpFieldAssets;
  signUpFields: SignUpField[] = this.defaultSignUpFields;
  errorMessage: string | undefined;
  hiddenFields: any = [];
  passwordPolicy: string | undefined;
  defaultCountryCode: string | undefined;
  protected logger: any;
  username: string | undefined;
  code: string | undefined;

  states = {
    emailVerifying: 'emailVerifying', codeVerifying: 'codeVerifying', passwordChange: 'passwordChange', profileSubmit: 'profileSubmit'
    , emailExists: 'emailExists'
  };
  state = this.states.profileSubmit;
  stateButtonTitle = 'Send Code';
  state_response = {
    status: 'Success',
    message: 'Please enter all the details carefully.',
  };

  forms: {

  }
  emailDisable = false;
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];

  constructor(
    private auth: AuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    @Inject(AmplifyService) public amplifyService: AmplifyService,
    public api: ApiService) {
    this.logger = this.amplifyService.logger('SignUpComponent');



    this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    this.showMessages = this.getConfigValue('forms.register.showMessages');
    this.strategy = this.getConfigValue('forms.register.strategy');
    this.forms = {
      login: {
        strategy: 'password',
        rememberMe: true,
        socialLinks: [],
      },
      register: {
        strategy: 'password',
        terms: true,
      },
      logout: {
        strategy: 'password',
      },
      requestPassword: {
        strategy: 'password',
      },
      resetPassword: {
        strategy: 'password',
      },
      validation: {
        password: {
          required: true,
          minLength: 6,
          maxLength: 50,
        },
        code: {
          required: true,
        },

        email: {
          required: true,
        },
        fullName: {
          required: true,
          minLength: 4,
          maxLength: 50,
        },
        designation: {
          required: false,

        },
      },
    }
  }
  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }







  ngOnInit() {
    if (!this.amplifyService.auth()) {
      throw new Error('Auth module not registered on AmplifyService provider');
    }
  }
  onResendVerificationCode() {

    this.auth.resendCode(this.user.email).subscribe((data) => {
      this.emailDisable = true;
    })
  }

  resendVerificationCode() {
    this.onResend();
  }

  onResend() {
    const email = this.user.email, password = this.user.password;

    this.auth.resendCode(email)
      .subscribe(
        result => {
          this.state = this.states.codeVerifying;
          this.stateButtonTitle = 'Verify Code';
          this.state_response.message = 'Please enter the verification code.';
          this.state_response.status = 'Success';
        },
        error => {
          // this.state = this.states.emailExists;
          this.state_response.message = error.message;
          this.state_response.status = 'Fail';
        });
  }


  onSubmitSignup() {
    const email = this.user.email, password = this.user.password;
    this.auth.signUp(email, password)
      .subscribe(
        result => {
          this.loading = false;

          this.successfullySignup = true;
          this.state = this.states.codeVerifying;
          this.stateButtonTitle = 'Verify Code';
          this.state_response.status = 'Success';
          this.state_response.message = 'Your Email is pre-approved by SuperAdmin';

        },
        error => {

          //   {code: "UsernameExistsException", name: "UsernameExistsException", message: "An account with the given email already exists."
          // }

          // this.state = this.states.emailExists;
          this.loading = false;
          this.state_response.message = error.message;
          this.state_response.status = 'Fail';
          if (error.code === 'UsernameExistsException') {
            // this.onResend();
            // this.state = this.states.emailExists;
            // this.state_response.message = 'User with this email Id already exists. Please Login.';
            // this.state_response.status = 'Fail';
          }
        }
      );
  }

  onSubmitConfirmation() {
    const email = this.user.email, confirmationCode = this.user.code;

    this.auth.confirmSignUp(email, confirmationCode)
      .subscribe(
        result => {
          this.loading = false;
          this.router.navigate(['auth/login']);
        },
        error => {
          this.errors = [];
          this.errors.push(error.message);
        });
  }

}
