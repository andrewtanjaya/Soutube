import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { SocialUser, SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass']
})
export class SideBarComponent implements OnInit {
  playlists : any
  activeTab = 0
  message : Boolean;
  curUser : any
  subbed : any
  constructor(private data : DataServiceService, private apollo : Apollo, private authService : SocialAuthService) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message =>this.message = message)
    if(localStorage.getItem("users")){
      this.findUser();
    }
    
    
  }

  //active tab
  isActive(tabId) : Boolean{
    return this.activeTab === tabId;
  }
  activate(activeTab): void{
    this.activeTab = activeTab;
  }

  user : SocialUser
  users = [];
  loggedIn : Boolean;
  getUserFromStorage() : SocialUser{
    this.users = JSON.parse(localStorage.getItem('users'));
    if(this.users != null){
      this.user = this.users[0];
      this.loggedIn = true;
      return this.user;
    }
    else null
    
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log("ini" + user);
      this.data.addToLocalStorage(user);
      this.data.userSource.next(user)
      
      this.data.getCurrentuser(user)
      this.apollo.watchQuery<any>({
        query: gql `
        query getUserId($email: String!){
        getUserId(email : $email) {
            user_id,
            user_name,
            membership,
            img_url,
            }
          }
        `,
        variables:{
        email: user.email
        }
        }).valueChanges.subscribe(result => {
        
        this.curUser = result.data.getUserId
        console.log(this.curUser)
        console.log("HIHIHI")
        window.location.reload()
        })

    });

    
  }
subbedChannel : any
  checkUser(sub : any):any{
    this.apollo.watchQuery<any>({
      query: gql `
        query getUser($user_id : Int!){
          getUser(user_id : $user_id) {
            user_id,
            user_name,
            membership,
            email,
            img_url,
            subscriber_count
          }
        }
      `,
      variables:{
        user_id: sub
      }
    }).valueChanges.subscribe(result => {
      this.subbedChannel = result.data.getUser
      return this.subbedChannel
    });
  }
  findUser(){
    
    this.curUser = JSON.parse(localStorage.getItem('users'))[0];
    console.log("asbbbb")
    console.log(this.curUser.email)
    this.apollo.watchQuery<any>({
      query: gql `
      query getUserId($email : String!) {
        getUserId(email: $email) {
          user_id
          user_name
          membership
          img_url
        }
      }
      
      `,
      variables:{
        email : this.curUser.email
      }
    }).valueChanges.subscribe(result => {
      this.curUser = result.data.getUserId;

      this.apollo.watchQuery<any>({
        query: gql `
          query getMySubs($subscriber_id : Int!){
            getMySubs(subscriber_id : $subscriber_id) {
              subscriber_id,
              user_id,
              subs_id
            }
          }
        `,
        variables:{
          subscriber_id: this.curUser.user_id
        }
      }).valueChanges.subscribe(result => {
        this.subbed = result.data.getMySubs
      })

      this.apollo.watchQuery<any>({
        query: gql `
        query getPlayListUser ($user_id : Int!){
          getPlayListUser(user_id : $user_id) {
            user_id
            playlist_id
            playlist_name
            visibility
          }
        }
        `,
        variables:{
          user_id: this.curUser.user_id
        }
      }).valueChanges.subscribe(result => {
        this.playlists = result.data.getPlayListUser;
        // alert(this.playlists)
      })
    })
  }

}
