import { Component, OnInit, Input } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-search-channel',
  templateUrl: './search-channel.component.html',
  styleUrls: ['./search-channel.component.sass']
})
export class SearchChannelComponent implements OnInit {
  @Input() channel :{}
  doneSubbed : Boolean;
  subbedChannel : any
  curUserAll : any;
  constructor(private apollo : Apollo) { }
  videos : any;
  ngOnInit(): void {
    if(localStorage.getItem("users")){
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
          email : JSON.parse(localStorage.getItem("users"))[0].email,
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
              second
            }
          }
          `,
          variables:{
            user_id : this.channel.user_id
          }
        })
        .valueChanges.subscribe(result => {
          this.videos = result.data.getVideoUser;
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
        user_id : this.channel.user_id,
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
            user_id: this.channel.user_id
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
            user_id : this.channel.user_id,
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
                user_id: this.channel.user_id
              }
          }]
        }).subscribe(result => {
          alert("Subscribed")
          window.location.reload()
        })
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
          user_id : this.channel.user_id,
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

}
