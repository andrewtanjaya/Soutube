import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channel-content',
  templateUrl: './channel-content.component.html',
  styleUrls: ['./channel-content.component.sass']
})
export class ChannelContentComponent implements OnInit {
  message : Boolean
  sortedVideos : any
  videos : any
  user : any
  curUser : any
  curUserAll : any
  subbed : any
  subbedChannel : any
  doneSubbed : boolean
  constructor(private data : DataServiceService ,  private apollo : Apollo, private _Activatedroute:ActivatedRoute) { }
  id : any;
  ngOnInit(): void {
    this.curUser = JSON.parse(localStorage.getItem("users"))[0].email
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
              subscriber_count
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
            second
          }
        }
        `,
        variables:{
          user_id : this.id
        }
      })
      .valueChanges.subscribe(result => {
        this.videos = result.data.getVideoUser;
        console.log(this.videos)
        this.sortedVideos = this.videos.sort((a,b) =>
          ((((a.day*86400)+(a.month*86400*30)+(a.year*86400*30*12)+(a.hour*3600)+(a.minute*60)+(a.second)) < ((b.day*86400)+(b.month*86400*30)+(b.year*86400*30*12)+(b.hour*3600)+(b.minute*60)+(b.second))) ? 1 : -1)
        )

        console.log(this.sortedVideos)
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

}
