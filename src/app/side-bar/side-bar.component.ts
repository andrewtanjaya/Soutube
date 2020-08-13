import { Component, OnInit, Input } from '@angular/core';
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
  privatePlay : any;
  publicPlay : any;
  activeTab = 0
  message : Boolean;
  a:any;
  b:any;
  curUser : any
  subbed : any
  index : number;
  indox : number
  saved : any;
  constructor(private data : DataServiceService, private apollo : Apollo, private authService : SocialAuthService) { }

  ngOnInit(): void {
    this.index = 5
    this.indox = 5
    this.playMore = false
    this.subsMore = false
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
        console.log(this.playlists)
            this.privatePlay = this.playlists.filter(function(playlist){
              return playlist.visibility == "Private"
            })
            if(this.privatePlay.length < 5){
              
              this.publicPlay = this.playlists.filter(function(playlist){
                return playlist.visibility == "Public"
              })
              // this.publicPlay.push(this.saved)
              this.publicPlay = this.publicPlay.slice(0,5-this.privatePlay.length)
          
              }
        // this.publicPlay.push(result.data.getSavedPlaylist)
        
        
        // alert(this.playlists)
      })
      this.apollo.watchQuery<any>({
        query: gql `
        query getSavedPlaylist($user_id: Int!){
          getSavedPlaylist(user_id : $user_id) {
            user_id,
            playlist_id,
            }
          }
        `,
        variables:{
        user_id: this.curUser.user_id
        }
        }).valueChanges.subscribe(result => {
          this.a = result.data.getSavedPlaylist
          console.log(this.curUser.user_id)
          console.log(this.a[1])
          for(let c = 0;this.a[c];c++){
            console.log("HOHOHO")
            console.log(c)
            this.apollo.watchQuery<any>({
              query: gql `
              query getPlaylist($playlist_id: Int!){
                getPlaylist(playlist_id : $playlist_id) {
                  playlist_id,
                  playlist_name,
                  visibility,
                  }
                }
              `,
              variables:{
              playlist_id: this.a[c].playlist_id
              }
              }).valueChanges.subscribe(result => {
              this.b = result.data.getPlaylist
              console.log(this.b )
              console.log(this.a);
              console.log(this.playlists)
              this.playlists.push(this.b)
              // if(!this.saved){
              //   this.saved = this.b
              // }
              // else{
              //   this.saved[this.saved.length] = this.b 
              // }
              // this.playlists.splice(this.playlists.length,0,this.b);
              console.log(this.saved)
              console.log(this.playlists)
              })

          }
          
        
        })
    })
  }

  playMore : Boolean
  togglePlaymore(){
    if(!this.playMore) 
    {

      // this.playlists.push(this.saved)
      this.privatePlay = this.playlists.filter(function(playlist){
      return playlist.visibility == "Private"
      })
      
      this.publicPlay = this.playlists.filter(function(playlist){
        return playlist.visibility == "Public"
      })
      // console.log(this.saved)
      // this.playlists = this.playlists.splice(this.playlists.length,2)
      console.log(this.playlists)
      console.log(this.publicPlay)
      

      this.index = 1000000
    }
    else{
      this.index = 5
      this.privatePlay = this.playlists.filter(function(playlist){
        return playlist.visibility == "Private"
      })
      if(this.privatePlay.length < 5){
        this.publicPlay = this.playlists.filter(function(playlist){
          return playlist.visibility == "Public"
        })
        this.publicPlay = this.publicPlay.slice(0,5-this.privatePlay.length)
      }
    }
    this.playMore = !this.playMore
    

  }

  subsMore : Boolean;
  togleSubs(){
    if(!this.subsMore) this.indox = 1000000
    else{
      this.indox = 5
    }
    this.subsMore = !this.subsMore
  }
}
