import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { SocialUser, SocialAuthService } from 'angularx-social-login';
import { Observable } from 'apollo-link';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  userSource; 
  private messageSource = new BehaviorSubject<Boolean>(true);
  private q = new BehaviorSubject<number>(0);
  private playlistbs = new BehaviorSubject<number>(0);
  currentMessage = this.messageSource.asObservable()
  nextQ = this.q.asObservable()
  playIndex = this.playlistbs.asObservable()
  private logState = new BehaviorSubject<Boolean>(false);
  loggedIn = this.logState.asObservable();

  private playQ = new BehaviorSubject<Array<any>>(null);
  plq = this.playQ.asObservable()
  
  
  
  constructor(private authService : SocialAuthService,private apollo : Apollo) {
    if(localStorage.getItem("users") == null)
      this.userSource= new BehaviorSubject<SocialUser>(null);
    else
      this.userSource= new BehaviorSubject<SocialUser>(this.user);
    this.currentUser = this.userSource.asObservable()
   }
   
   users = []
   currentUser : Observable<SocialUser>
   user : SocialUser
   logIn : boolean

  getUserFromStorage(){
    this.users = JSON.parse(localStorage.getItem('users'));
    if(this.users != null){
      this.user = this.users[0];
      this.logIn = true;
    }
  }
  removeUser(){
    while(localStorage.getItem('users') != null){
      window.localStorage.clear();  
      console.log("Masuk clear")
    }
    
    this.userSource.next(null);
    window.location.reload();
    
  }

  signOut(){
    this.authService.signOut(true);
    this.removeUser();
  }
  membership : Boolean;
  img_url : String;
  email : String;
  user_name : String;
  subscriber_count : number;

  addToLocalStorage(user){
    let today = new Date()
    this.users.push(user);
    console.log("ini add we");
    localStorage.setItem('users', JSON.stringify(this.users));
    console.log(this.checkUserInDb(user))
    console.log(today.getDate());
    console.log(today.getMonth()+1);
    console.log(today.getFullYear());
    console.log(today.getHours());
    console.log(today.getMinutes());
    console.log(today.getSeconds());
    if(this.checkUserInDb(user) == false){
      console.log(user)
      this.membership = false;
      this.img_url = user.photoUrl;
      this.email = user.email;
      this.user_name = user.name;
      this.subscriber_count = 0;

  
      this.apollo.mutate({
        mutation: gql `
        mutation createNewUser($membership : Boolean!, $img_url : String!, $email : String!, $user_name : String!, $subscriber_count : Int!, $day : Int!, $month : Int! , $year : Int!, $hour : Int!, $minute : Int! , $second : Int! , $back : String! , $desc : String!, $shared : String!, $premium : Time!){
          createUser(input: {membership : $membership,img_url : $img_url, email : $email , user_name : $user_name , subscriber_count : $subscriber_count, day : $day, month : $month , year : $year , hour : $hour, minute : $minute , second : $second , back : $back , desc : $desc , shared : $shared , premium : $premium}){
            user_id,
            membership,
            img_url,
            email,
            user_name,
            subscriber_count,
            day,
            month,
            year,
            hour,
            minute,
            second,
            back,
            desc,
            shared,
            premium,
          }
        }      
          `,
          variables:{
            membership : this.membership,
            img_url : this.img_url,
            email : this.email,
            user_name : this.user_name,
            subscriber_count : this.subscriber_count,
            day : today.getDate(),
            month : today.getMonth()+1,
            year : today.getFullYear(),
            hour : today.getHours(),
            minute : today.getMinutes(),
            second : today.getSeconds(),
            back : "null",
            desc : "null",
            shared : "null",
            premium : new Date(),
          }
      }).subscribe(result => {
        alert('inserted new account');
      },(error) => {
        console.log('there was an error sending the query', error);
      });
    }
    
  } 

  

  

checkUserInDb(user : SocialUser) : boolean{
  console.log(user.email)
  this.apollo.watchQuery({
    query: gql `
      query getUserId($email: string!){
        getUserId(email: $email) {
          user_id,
          user_name,
          membership
        }
      }
    `,
    variables:{
      email: user.email
    }
  }).valueChanges.subscribe(result => {
    console.log(user);
    console.log("CHECKED")
    console.log(result)
    return true;
  })
  console.log(user.email)
  return false;
}
  
getCurrentuser(currentUser : SocialUser){
  this.userSource.next(currentUser);
}

  getState(loggedIn : Boolean){
    this.logState.next(loggedIn);
  }

  changeMessage(message : Boolean){
    this.messageSource.next(message)
  }

  changeQ(q : number){
    this.q.next(q);
  }

  changeIndex(playIndex : number){
    this.playlistbs.next(playIndex)
  }

  changePlay(plq : Array<any>){
    this.playQ.next(plq);
  }
}
