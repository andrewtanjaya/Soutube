import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-sub-content',
  templateUrl: './sub-content.component.html',
  styleUrls: ['./sub-content.component.sass']
})
export class SubContentComponent implements OnInit {
  videos : any
  subbed : any
  message : Boolean;
  constructor(private data : DataServiceService,private apollo : Apollo) { }
  check : any;
  today : any;
  week : any;
  months : any;
  ngOnInit(): void {
    this.data.currentMessage.subscribe(message =>this.message = message)
    this.check = JSON.parse(localStorage.getItem("users"))[0]
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
        email : this.check.email
      }
    }).valueChanges.subscribe(result => {
      this.check = result.data.getUserId;

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
          subscriber_id: this.check.user_id
        }
      }).valueChanges.subscribe(result => {
        this.subbed = result.data.getMySubs
        for(let i=0; this.subbed[i] ; i++){
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
                user_id : this.subbed[i].user_id
              }
            })
            .valueChanges.subscribe(result => {
              if(this.videos){
                this.videos = this.videos.concat(result.data.getVideoUser);
              }
              else{
                this.videos = (result.data.getVideoUser);
              }
              
              console.log(this.videos)
              
              let now = new Date()
              this.today = this.videos.filter(function(video){
                // return ((video.day*86400)+(video.month*86400*30)+(video.year*86400*30*12)+(video.hour*3600)+(video.minute*60)+(video.second)) - ((now.getDate()*86400)+((now.getMonth()+1)*86400*30)+(now.getFullYear()*86400*30*12)+(now.getHours()*3600)+(now.getMinutes()*60)+(now.getSeconds())) < 86400
                return video.day == now.getDate() && video.month == now.getMonth()+1 && video.year == now.getFullYear();
              })
              this.today = this.today.sort((a,b) =>
                ((((a.day*86400)+(a.month*86400*30)+(a.year*86400*30*12)+(a.hour*3600)+(a.minute*60)+(a.second)) < ((b.day*86400)+(b.month*86400*30)+(b.year*86400*30*12)+(b.hour*3600)+(b.minute*60)+(b.second))) ? 1 : -1)
              )
              this.week = this.videos.filter(function(video){
                return video.day <= now.getDate()+7 && video.month == now.getMonth()+1 && video.year == now.getFullYear();
              })
              this.week = this.week.sort((a,b) =>
              ((((a.day*86400)+(a.month*86400*30)+(a.year*86400*30*12)+(a.hour*3600)+(a.minute*60)+(a.second)) < ((b.day*86400)+(b.month*86400*30)+(b.year*86400*30*12)+(b.hour*3600)+(b.minute*60)+(b.second))) ? 1 : -1)
            )
              this.months = this.videos.filter(function(video){
                if(video.month == now.getMonth()+1)
                return true;
                else{
                  if((now.getMonth()+1) - video.month > 1){
                    return false;
                  }else if(((now.getMonth())*30 + now.getDate()) - ((video.month-1)*30 + video.day) <= 30){
                    return true
                  }
                  else{
                    return false
                  }
                }
                // return video.month == now.getMonth()+1 && video.day <= now.getDate()+30   && video.year == now.getFullYear();
              })
              this.months = this.months.sort((a,b) =>
                ((((a.day*86400)+(a.month*86400*30)+(a.year*86400*30*12)+(a.hour*3600)+(a.minute*60)+(a.second)) < ((b.day*86400)+(b.month*86400*30)+(b.year*86400*30*12)+(b.hour*3600)+(b.minute*60)+(b.second))) ? 1 : -1)
              )
            }); 
        }
      })
    //   this.apollo
    // .watchQuery({
    //   query: gql`
    //     {
    //       videos{
    //         video_id
    //         video_url
    //         video_title
    //         video_desc
    //         video_cat
    //         video_thumb
    //         playlist_id
    //         like_count
    //         dislike_count
    //         view_count
    //         age_restriction
    //         visibility
    //         location_video
    //         status
    //         premium
    //         user_id
    //         video_duration
    //         day
    //         month
    //         year
    //         hour
    //         minute
    //         second
    //       }
    //     }
    //   `,
    // })
    // .valueChanges.subscribe(result => {
    //   this.videos = result.data.videos;
    // });
    
  })

  }
}
