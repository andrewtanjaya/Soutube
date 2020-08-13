import { Component, OnInit, HostListener } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { SocialUser, SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { variable } from '@angular/compiler/src/output/output_ast';
import { AnyTxtRecord } from 'dns';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  i = 1;
  modal : Boolean;
  notifs :any;
  subbed : any;
  message : Boolean;
  userState : Boolean;
  showAc : Boolean
  videos : any
  showKey : Boolean;
  allchannel : any;
  playlists : any
  isi : any;
  constructor(private data : DataServiceService, private authService : SocialAuthService,private apollo : Apollo, private router : Router) { }

  ngOnInit(): void {
    this.modal = false
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
    const flyoutElement = document.getElementById("backg");
    let targetElement = evt.target; // clicked element

    do {
        if (targetElement == flyoutElement) {
            // Do nothing, just return.
            this.modal = false
            return;
        }
        // Go up the DOM.
        targetElement = targetElement.parentNode;
    } while (targetElement);


});
document.addEventListener("click", (evt) => {
  const flyoutElement = document.getElementById("modKey");
  let targetElement = evt.target; // clicked element

  do {
      if (targetElement == flyoutElement) {
          // Do nothing, just return.
          this.showKey = false
          return;
      }
      // Go up the DOM.
      targetElement = targetElement.parentNode;
  } while (targetElement);


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
        this.apollo.watchQuery<any>({
          query: gql `
          query getPlaylists {
            playlists {
              playlist_id
              playlist_name
              visibility
              user_id
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
            this.playlists = result.data.playlists
          })
    }
    else{
      this.refreshAC()
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
            subscriber_id: this.currentUser.user_id
          }
        }).valueChanges.subscribe(result => {
          this.subbed = result.data.getMySubs
          console.log(this.subbed)

          
          if(this.subbed[0]){
            this.apollo.watchQuery<any>({
              query: gql `
                query getNotif($user_id : Int!){
                  getNotif(user_id : $user_id) {
                    user_id,
                    types,
                    date,
                    user_name,
                    img_url
                  }
                }
              `,
              variables:{
                user_id: this.subbed[0].user_id
              }
            }).valueChanges.subscribe(result => {
              // this.notifs = new Array()
              this.notifs = result.data.getNotif
              
              
              console.log(this.notifs)
            });

          }
          if(this.subbed[1]){
            this.apollo.watchQuery<any>({
              query: gql `
                query getNotif($user_id : Int!){
                  getNotif(user_id : $user_id) {
                    user_id,
                    types,
                    date,
                    user_name,
                    img_url
                  }
                }
              `,
              variables:{
                user_id: this.subbed[1].user_id
              }
            }).valueChanges.subscribe(result => {
              // this.notifs = new Array()
              // this.notifs.unshift(result.data.getNotif)
              if(this.notifs)
              this.notifs.push(result.data.getNotif)
              else{
                this.notifs = result.data.getNotif
              }
              // this.notifs[this.notifs.length].date = result.data.getNotif.date
              // this.notifs[this.notifs.length].img_url = result.data.getNotif.img_url
              // this.notifs[this.notifs.length].types = result.data.getNotif.types
              // this.notifs[this.notifs.length].user_id = result.data.getNotif.user_id
              console.log(this.notifs)
              
            });

          }
          
        })
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
    this.modal = false;
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
        // window.location.reload()
        })

    });

    
  }
  

  signOut(): void {
    this.data.signOut();
    // this.user = null;
    this.data.currentUser.subscribe(user => this.user = user)
    // this.signInWithGoogle()
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
          
        })

        this.apollo.watchQuery<any>({
          query: gql `
          query getPlaylists {
            playlists {
              playlist_id
              playlist_name
              visibility
              user_id
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
            this.playlists = result.data.playlists
          })

        
  }
  move(){
    this.isi = document.getElementById("searchIn").value;
    this.router.navigate(["/search/"+this.isi])
  }

  refreshAC(){
    this.isi = document.getElementById("searchIn").value;
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
        this.apollo.watchQuery<any>({
          query: gql `
          query checkPlaylistLike($playlist_name : String!){
            checkPlaylistLike(playlist_name : $playlist_name){
              playlist_name
            }
          }
          `,
          variables :{
            playlist_name : "%" + document.getElementById("searchIn").value +"%"
          }
          }).valueChanges.subscribe(result => {
            this.playlists = result.data.checkPlaylistLike
          })
  }

  getSearch(video_title : String){
    document.getElementById("searchIn").value = video_title
  }


  toggleModal(){
    this.modal = !this.modal
  }


  getDateDiff(asd: string): string {
    let dateDif = '';
    const currentDate = new Date();
    const publish = new Date(asd)
    const min = Math.floor(
      (Date.UTC(currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes(),
        currentDate.getSeconds(),
        currentDate.getMilliseconds()
      ) -
      Date.UTC(publish.getFullYear(),
      publish.getMonth(),
      publish.getDate(),
      publish.getHours(),
      publish.getMinutes(),
      publish.getSeconds(),
      publish.getMilliseconds())
      ) / (1000));
    let temp = 0;
    //ini 1000 ms berarti 1 detik
  
    if (min <= 0){
      temp = -1 * min;
      console.log('temp ', temp);
      dateDif = 'Will be released in ';
    } else {
      temp = min;
    }
  
    const y = Math.floor(temp / 31556952);
    // console.log('Year ', y);
    if (y <= 0) {
      const mon = Math.floor(temp / 2629746);
      // console.log('month ', mon);
  
      if (mon <= 0) {
        const d = Math.floor(temp / 86400);
        // console.log('day ', d);
        if (d <= 0) {
          const hour = Math.floor(temp / 3600);
          // console.log('hour ', hour);
          if (hour <= 0) {
            const minute = Math.floor(temp / 60);
            // console.log('minute ', minute);
            if (minute <= 0) {
              const second = temp;
              // console.log('second ', second);
              if (min < 0) {
                dateDif += second.toString() + ' Second(s)';
              } else {
                dateDif = second.toString() + ' second Ago';
              }
            } else {
              if (min < 0) {
                dateDif += minute.toString() + ' Minute(s)';
              } else {
                dateDif = minute.toString() + ' Minute Ago';
              }
            }
          } else {
            if (min < 0) {
              dateDif += hour.toString() + ' Hour(s)';
            } else {
              dateDif = hour.toString() + ' Hour Ago';
            }
          }
        } else {
          if (min < 0) {
            dateDif += d.toString() + ' Day(s)';
          } else {
            dateDif = d.toString() + ' Day(s) Ago';
          }
        }
      } else {
        if (min < 0) {
          dateDif += mon.toString() + ' Month';
        } else {
          dateDif = mon.toString() + ' Month Ago';
        }
      }
    } else {
      if (min < 0) {
        dateDif += y.toString() + ' Year';
      } else {
        dateDif = y.toString() + ' Year Ago';
      }
    }
  
    return dateDif;
  }
  
}
