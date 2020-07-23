import { Component, OnInit, HostListener } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { SocialUser, SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  message : Boolean;
  userState : Boolean;
  showAc : Boolean
  videos : any
  showKey : Boolean;
  allchannel : any;
  constructor(private data : DataServiceService, private authService : SocialAuthService,private apollo : Apollo) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message =>this.message = message)
    this.data.loggedIn.subscribe(userState => this.userState = userState)

    document.addEventListener("click", (evt) => {
      const flyoutElement = document.getElementById("searchIn");
      let targetElement = evt.target; // clicked element
  
      do {
          if (targetElement == flyoutElement) {
              // Do nothing, just return.
              this.showAc = true
              return;
          }
          // Go up the DOM.
          targetElement = targetElement.parentNode;
      } while (targetElement);
  
      // Do something useful here.
      this.showAc = false
  });
  document.addEventListener("click", (evt) => {
    const flyoutElement = document.getElementById("signDived");
    let targetElement = evt.target; // clicked element

    do {
        if (targetElement == flyoutElement) {
            // Do nothing, just return.

            this.userPop = true
            return;
        }
        // Go up the DOM.
        targetElement = targetElement.parentNode;
    } while (targetElement);

    // Do something useful here.
    this.userPop = false
  });
  document.addEventListener("click", (evt) => {
    const flyoutElement = document.getElementById("ad");
    let targetElement = evt.target; // clicked element

    do {
        if (targetElement == flyoutElement) {
            // Do nothing, just return.

            this.showAdd = true
            return;
        }
        // Go up the DOM.
        targetElement = targetElement.parentNode;
    } while (targetElement);

    // Do something useful here.
    this.showAdd = false
  });
    
    if(document.getElementById("searchIn").value == ""){
      this.apollo.watchQuery<any>({
        query: gql `
        query getAllVideo {
          videos {
            video_id
            video_url
            video_title
            video_desc
            video_cat
            video_thumb
            playlist_id
            like_count
            dislike_count
            view_count
            age_restriction
            visibility
            location_video
            status
            premium
            day
            month
            year
            hour
            minute
            second
          }
        }
        `
        }).valueChanges.subscribe(result => {
          this.videos = result.data.videos
        })
    }
    else{
      this.refreshAC(document.getElementById("searchIn").value)
    }

    this.apollo.watchQuery<any>({
      query: gql `
      query getAllUser {
        users {
          user_id
          membership
          img_url
          email
          user_name
          subscriber_count
          day
            month
            year
            hour
            minute
            second
        }
      }
      `
      }).valueChanges.subscribe(result => {
        this.allchannel = result.data.users
      })

    if(localStorage.getItem("users") != null){
      this.data.getUserFromStorage()
      
      this.apollo.watchQuery<any>({
        query: gql `
        query getUserId($email: String!){
        getUserId(email : $email) {
            user_id,
            user_name,
            membership,
            img_url,
            day
            month
            year
            hour
            minute
            second
            }
          }
        `,
        variables:{
        email: JSON.parse(localStorage.getItem("users"))[0].email
        }
        }).valueChanges.subscribe(result => {
        
        this.currentUser = result.data.getUserId
        console.log(this.currentUser)
        console.log("HIHIHI")
        })
      // this.data.currentUser.subscribe(currentUser => this.user = currentUser)
      this.user = this.data.user;
    }
    else{
      this.data.users = []
    }
  }
  
  membership : boolean;
  imgUrl : string;
  email : string;
  userName : string;
  subscriberCount : number;
  currentUser : any // user yg logged in skrg

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
            day
            month
            year
            hour
            minute
            second
            }
          }
        `,
        variables:{
        email: user.email
        }
        }).valueChanges.subscribe(result => {
        
        this.currentUser = result.data.getUserId
        console.log(this.currentUser)
        console.log("HIHIHI")
        })

    });

    
  }
  

  signOut(): void {
    console.log("sign Out dong")
    this.data.signOut();
    // this.user = null;
    this.data.currentUser.subscribe(user => this.user = user)
    
  }

  //hamburger
  newMessage(){
    if (this.message == false){
      this.data.changeMessage(true);
    }
    else{
      this.data.changeMessage(false);
    }

  }
  
  //upload
  showAdd = false
  toggleAdd(){
    if(this.showAdd == false){
      this.more = false;
      this.showAdd = true;
      this.userPop = false
    }
    else{
      this.showAdd = false;
    }
  }

  toggleKey(){
    this.more = false;
    this.showAdd = false;
    this.userPop = false;
    this.showKey = !this.showKey
  }

  //more
  more  = false
  toggleMore(){
    if(this.more == false){
      this.more = true;
      this.showAdd = false;
      this.userPop = false
    }
    else{
      this.more = false
    }
  }

  //buat responsive
  screenHeight : any
  screenWidth : any
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 800) {
      if (this.message == true){
        this.data.changeMessage(false);
      }
      else{
        this.data.changeMessage(false);
      }
    }
  }
  
  users = [];
  user : SocialUser;
  loggedIn : Boolean;

  userPop = false;
  toggleUserPop(){
    this.userPop = !this.userPop;
    if(this.more == true) this.more = false
    if(this.showAdd == true) this.showAdd = false
  }

  toogleAc(){
    this.showAc = !this.showAc
    this.apollo.watchQuery<any>({
      query: gql `
      query getAllVideo {
        videos {
          video_id
          video_url
          video_title
          video_desc
          video_cat
          video_thumb
          playlist_id
          like_count
          dislike_count
          view_count
          age_restriction
          visibility
          location_video
          status
          premium
          day
            month
            year
            hour
            minute
            second
        }
      }
      `
      }).valueChanges.subscribe(result => {
        this.videos = result.data.videos
      })
      this.apollo.watchQuery<any>({
        query: gql `
        query getAllUser {
          users {
            user_id
            membership
            img_url
            email
            user_name
            subscriber_count
            day
            month
            year
            hour
            minute
            second
          }
        }
        `
        }).valueChanges.subscribe(result => {
          this.allchannel = result.data.users
          alert("asd")
        })
        
  }

  refreshAC(){
    this.apollo.watchQuery<any>({
      query: gql `
      query getAllVideoLike($video_title : String!) {
        checkVideoLike(video_title : $video_title) {
          video_id
          video_url
          video_title
          video_desc
          video_cat
          video_thumb
          playlist_id
          like_count
          dislike_count
          view_count
          age_restriction
          visibility
          location_video
          status
          premium
        }
      }
      `,
      variables :{
        video_title : "%" + document.getElementById("searchIn").value +"%"
      }
      }).valueChanges.subscribe(result => {
        this.videos = result.data.checkVideoLike
        
      })
      this.apollo.watchQuery<any>({
        query: gql `
        query checkChannelLike($user_name : String!){
          checkChannelLike(user_name : $user_name){
            user_name
          }
        }
        `,
        variables :{
          user_name : "%" + document.getElementById("searchIn").value +"%"
        }
        }).valueChanges.subscribe(result => {
          this.allchannel = result.data.checkChannelLike
        })
  }

  getSearch(video_title : String){
    document.getElementById("searchIn").value = video_title
  }


}
