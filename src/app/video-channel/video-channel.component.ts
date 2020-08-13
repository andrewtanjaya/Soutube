import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';

@Component({
  selector: 'app-video-channel',
  templateUrl: './video-channel.component.html',
  styleUrls: ['./video-channel.component.sass']
})
export class VideoChannelComponent implements OnInit {
user : any
id : any;
videos : any;
oriVideos : any;
curUser : any;
subbedChannel : any
doneSubbed : boolean
curUserAll : any
subbed  : any
  constructor(private data : DataServiceService, private apollo : Apollo,private _Activatedroute : ActivatedRoute) { }
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
    this.sortedDate =  false
    this.sortedPop = false
    this.data.currentMessage.subscribe(message =>this.message = message)
    
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('user_id'); 
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
              back,
            }
          }
        `,
        variables:{
          user_id: this.id
        }
      }).valueChanges.subscribe(result => {
        this.user = result.data.getUser
      })
    });
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
            back
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
      }).valueChanges.subscribe(result => {
        this.subbed = result.data.getSubscriber
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
    

    this.apollo
      .watchQuery<any>({
        query: gql`
        query getVideoUser($user_id : Int!){
          getVideoUser(user_id : $user_id) {
            video_id,
            video_url,
            video_title,
            video_desc,
            video_cat,
            video_thumb,
            playlist_id,
            like_count,
            dislike_count,
            view_count,
            age_restriction,
            visibility,
            location_video,
            status,
            premium,
            user_id,
            video_duration,
            day,
            month,
            year,
            hour,
            minute,
            second,
          }
        }
        `,
        variables:{
          user_id : this.id
        }
      })
      .valueChanges.subscribe(result => {
        this.videos = result.data.getVideoUser;
        this.oriVideos = this.videos.slice();
      });
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

  sortedPop : Boolean;
  sortPop(){
    if(this.sortedPop){
      this.videos = this.oriVideos.slice().sort((a,b) =>
      a.view_count > b.view_count ? -1 : 1
      )
      this.sortedPop = false
    }
    else{
      this.videos = this.oriVideos.slice().sort((a,b) =>
      a.view_count < b.view_count ? -1 : 1
      )
      this.sortedPop = true
    }
    
  }
  sortedDate : Boolean;
  sortDate(){
    if(this.sortedDate){
      this.videos = this.oriVideos.slice().sort((a,b) =>
      ((((a.day*86400)+(a.month*86400*30)+(a.year*86400*30*12)+(a.hour*3600)+(a.minute*60)+(a.second)) < ((b.day*86400)+(b.month*86400*30)+(b.year*86400*30*12)+(b.hour*3600)+(b.minute*60)+(b.second))) ? 1 : -1)
    )
    this.sortedDate = false
    }
    else{
      this.videos = this.oriVideos.slice().sort((a,b) =>
      ((((a.day*86400)+(a.month*86400*30)+(a.year*86400*30*12)+(a.hour*3600)+(a.minute*60)+(a.second)) > ((b.day*86400)+(b.month*86400*30)+(b.year*86400*30*12)+(b.hour*3600)+(b.minute*60)+(b.second))) ? 1 : -1)
    )
    this.sortedDate = true
    }
  }


}









