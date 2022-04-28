import { Component, OnInit } from '@angular/core';
import {
  
	CognitoUserPool,
	CognitoUserAttribute,
  CognitoUser,
  
} from 'amazon-cognito-identity-js';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

interface formDataInterface {
  "email": string;
  [key: string]: string;
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent implements OnInit {

  isLoading:boolean = false;
  email:string = '';
  password:string = '';
  otp:string = '';
  otpSent:boolean=false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm){
    if (form.valid) {
     this.isLoading = true;

     var poolData = {
       UserPoolId: environment.cognitoUserPoolId, // Your user pool id here
       ClientId: environment.cognitoAppClientId // Your client id here
     };

     console.log(poolData);

     var userPool = new CognitoUserPool(poolData);
     
     var attributeList = [];
     
     let formData:formDataInterface = {
       "email": this.email,
       "password": this.password,
     }
    let key ='email'
    let attrData = {
      Name: key,
      Value: formData[key]
    }
   console.log(this.password)

    let attribute = new CognitoUserAttribute(attrData);
    attributeList.push(attribute)
     console.log(attributeList)
     userPool.signUp(this.email, this.password, attributeList, [], (
       err,
       result
     ) => {
       this.isLoading = false;
       if (err) {
         alert(err.message || JSON.stringify(err));
         return;
       }
       this.otpSent =true;
      //  this.router.navigate(['/signin']);
     });
    }
   else{
     alert("Invalid")
   }
 }

 resendCode(){
  var poolData = {
    UserPoolId: environment.cognitoUserPoolId, // Your user pool id here
    ClientId: environment.cognitoAppClientId // Your client id here
  };

  var userPool = new CognitoUserPool(poolData);
  let userData = {
    Username: this.email,
    Pool: userPool,
  };
   
  let cognitoUser = new CognitoUser(userData);
  cognitoUser.resendConfirmationCode(function(err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    console.log('call result: ' + result);
  });
 }
 onConfirmSignup(form: NgForm){
  if (form.valid) {
    this.isLoading = true;

    var poolData = {
      UserPoolId: environment.cognitoUserPoolId, // Your user pool id here
      ClientId: environment.cognitoAppClientId // Your client id here
    };

    var userPool = new CognitoUserPool(poolData);
    
    let formData:formDataInterface = {
      "email": this.email,
      "otp": this.otp,
    }
   let userData = {
    Username: this.email,
    Pool: userPool,
  };
   console.log(userData)
  let cognitoUser = new CognitoUser(userData);
cognitoUser.confirmRegistration(this.otp, true, function(err, result) {
	if (err) {
		alert(err.message || JSON.stringify(err));
		return;
	}
	console.log('call result: ' + result);

});
this.router.navigate(['/signin']);

}
  else{
    alert("Invalid")
    
  }
  
 }

}
