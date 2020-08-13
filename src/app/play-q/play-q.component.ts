import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { DataServiceService } from '../data-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-play-q',
  templateUrl: './play-q.component.html',
  styleUrls: ['./play-q.component.sass']
})
export class PlayQComponent implements OnInit {
  curUser  : any;
  subbedChannel : any;
  curUserAll : any;
  doneSubbed : any;
  user : any;
  subbed : any;
  playlists : any;
  id : any;
  message : Boolean;
  constructor(private apollo : Apollo, private data : DataServiceService, private _Activatedroute : ActivatedRoute) { }
  convertMetricNumber(num: number): string {
    for(let i: number = 0; i < this.ranges.length; i++){
      if(num >= this.ranges[i].divider){
        return Math.floor((num / this.ranges[i].divider)).toString() + this.ranges[i].suffix
      }
    }

    return num.toString();
  } 

  ranges = [
    { divider: 1e18 , suffix: 'E' },
    { divider: 1e15 , suffix: 'P' },
    { divider: 1e12 , suffix: 'T' },
    { divider: 1e9 , suffix: 'B' },
    { divider: 1e6 , suffix: 'M' },
    { divider: 1e3 , suffix: 'k' }
  ];
  ngOnInit(): void {
    this.data.currentMessage.subscribe(message =>this.message = message)
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('user_id'); 
    })
    this.apollo.watchQuery<any>({
      query: gql `
        query getUser($user_id : Int!){
          getUser(user_id : $user_id) {
            user_id,
            user_name,
            membership,
            email,
            img_url,
            subscriber_count,
            day,
            month,
            year,
            hour,
            minute,
            second,
            back,
            
          }
        }
      `,
      variables:{
        user_id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
      this.apollo.watchQuery<any>({
        query: gql `
        query getPlayListUser ($user_id : Int!){
          getPlayListUser(user_id : $user_id) {
            user_id
            playlist_id
            playlist_name
            visibility
            description
          }
        }
        `,
        variables:{
          user_id: this.id
        }
      }).valueChanges.subscribe(result => {
        this.playlists = result.data.getPlayListUser;
    })
      this.apollo.watchQuery<any>({
        query: gql `
          query getSubscriber($user_id : Int!){
            getSubscriber(user_id : $user_id) {
              subscriber_id,
              user_id,
              subs_id
            }
          }
        `,
        variables:{
          user_id: this.user.user_id
        }
      }).valueChanges.subscribe(result => {
        this.subbed = result.data.getSubscriber
        this.apollo.mutate({
          mutation: gql `

          mutation updateUser (
                  $user_id : Int!,
                  $membership : Boolean!,
                  $img_url : String!,
                  $email : String!,
                  $user_name : String!,
                  $subscriber_count : Int!,
                  $day : Int!,
                  $month : Int!,
                  $year : Int!,
                  $hour : Int!,
                  $minute : Int!,
                  $second : Int!

          ) {
            updateUser(
              user_id : $user_id , input : { membership : $membership , img_url : $img_url , email : $email , user_name : $user_name, subscriber_count : $subscriber_count , day : $day, month : $month , year : $year , hour : $hour , minute : $minute, second : $second }
            ){
              user_id,
              
            }
          } 
          `,
          variables:{
            user_id : this.id,
            membership : this.user.membership,
            img_url : this.user.img_url,
            email : this.user.email,
            user_name : this.user.user_name,
            subscriber_count : this.subbed.length,
            day : this.user.day,
            month : this.user.month,
            year : this.user.year,
            hour : this.user.hour,
            minute : this.user.minute,
            second : this.user.second
          }
        }).subscribe((result) => {
        },(error) => {
          console.log('there was an error sending the query', error);
        });
      })
  });
  if(localStorage.getItem("users")){
        this.curUser = JSON.parse(localStorage.getItem("users"))[0].email
      this.apollo.watchQuery<any>({
        query: gql `
        query getUserId ($email : String!) {
          getUserId(email: $email) {
            user_id,
            user_name,
            membership,
            email,
          }
        }
        `,
        variables:{
            email : this.curUser,
        }
      }).valueChanges.subscribe(result => {
        // alert(this.comment.comment_id)
        this.curUserAll = result.data.getUserId
        this.checkSubbed()
      });
    }
    
}

checkSubbed(){
  this.apollo.watchQuery<any>({
    query: gql `
    query checkSubs($user_id : Int! , $subscriber_id : Int!) {
      checkSubs(user_id : $user_id , subscriber_id : $subscriber_id) {
        user_id,
        subs_id,
        subscriber_id,
      }
    }
    `,
    variables:{
        user_id : this.id,
        subscriber_id : this.curUserAll.user_id,
    }
  }).valueChanges.subscribe(result => {
    this.subbedChannel = result.data.checkSubs
    if(this.subbedChannel.subs_id != 0){
      this.doneSubbed = true
    }
    else{
      this.doneSubbed = false
    }
  });
}

unSubs(){
  this.apollo.mutate({
    mutation: gql `
    mutation deleteSubs($user_id : Int! , $subscriber_id : Int!){
      deleteSubs(user_id : $user_id , subscriber_id : $subscriber_id)
    }
    `,
    variables:{
      user_id : this.id,
      subscriber_id : this.curUserAll.user_id
    },
    refetchQueries:[{
      query: gql `
          query getSubscriber($user_id : Int!){
            getSubscriber(user_id : $user_id) {
              subscriber_id,
              user_id,
              subs_id
            }
          }
        `,
        variables:{
          user_id: this.id
        }
    }]
  }).subscribe(result => {
    alert("Unsubscribed")
    window.location.reload()
  })
}

addSubs(){
  if(this.doneSubbed != true){
      this.apollo.mutate({
        mutation: gql `
        mutation createSubs ($user_id : Int! , $subs_id : Int!){
          createSubs(
            input : {
              user_id : $user_id,
              subscriber_id : $subs_id
            }
          ){
            subscriber_id,
            user_id,
            subs_id
          }
        }
        `,
        variables:{
          user_id : this.user.user_id,
          subs_id : this.curUserAll.user_id,
        },
        refetchQueries:[{
          query: gql `
              query getSubscriber($user_id : Int!){
                getSubscriber(user_id : $user_id) {
                  subscriber_id,
                  user_id,
                  subs_id
                }
              }
            `,
            variables:{
              user_id: this.id
            }
        }]
      }).subscribe(result => {
        alert("Subscribed")
        window.location.reload()
      })
  }
  
}

}
