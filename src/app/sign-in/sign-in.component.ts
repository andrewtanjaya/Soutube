import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {
  users = []
  user : SocialUser;
  loggedIn: boolean;
  
  constructor(private authService: SocialAuthService,private data : DataServiceService) { }

  signInWithGoogle(): void {

    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log("ini user yak " + this.user);
      // this.data.addToLocalStorage(this.user);
      this.data.userSource.next(user)
    });
  }

  

  // getUserFromStorage() : SocialUser{
  //   this.users = JSON.parse(localStorage.getItem('users'));
  //   if(this.users != null){
  //     this.user = this.users[0];
  //     this.loggedIn = true;
  //     return this.user;
  //   }
  //   else null
  // }

  removeUser(){
    window.localStorage.clear();
    this.loggedIn = false;
  }

  signOut(): void {
    this.data.signOut();

    this.data.currentUser.subscribe(user => this.user = null)
    
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

}
