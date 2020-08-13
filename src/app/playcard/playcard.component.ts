import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playcard',
  templateUrl: './playcard.component.html',
  styleUrls: ['./playcard.component.sass']
})
export class PlaycardComponent implements OnInit {
  @Input() play :{}
  video : any
  user : any
  constructor(private apollo : Apollo) { }

  ngOnInit(): void {
    this.apollo.watchQuery<any>({
      query: gql `
      query getVideo($video_id : Int!) {
        getVideo(video_id : $video_id) {
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
        video_id: this.play.video_id
      }
    }).valueChanges.subscribe(result => {
      this.video = result.data.getVideo;
      if(this.video.video_duration/60 < 10){
        if(this.video.video_duration%60 < 10){
          this.durr = "<p>0"+Math.floor(this.video.video_duration/60)+":0"+ this.video.video_duration%60+"</p>"
          // document.getElementById(id).innerHTML = "0"+Math.floor(this.video.video_duration/60)+":0"+ this.video.video_duration%60
        }
        else{
          this.durr = "<p>0"+Math.floor(this.video.video_duration/60)+":"+ this.video.video_duration%60+"</p>"
          // document.getElementById(id).innerHTML = "0"+Math.floor(this.video.video_duration/60)+":"+ this.video.video_duration%60
        }
      }
      else{
        if(this.video.video_duration%60 < 10){
          this.durr = "<p>"+Math.floor(this.video.video_duration/60)+":0"+ this.video.video_duration%60+"</p>"
          // document.getElementById(id).innerHTML = ""+Math.floor(this.video.video_duration/60)+":0"+ this.video.video_duration%60
        }
        else{
          this.durr = "<p>"+Math.floor(this.video.video_duration/60)+":"+ this.video.video_duration%60+"</p>"
          // document.getElementById(id).innerHTML = ""+Math.floor(this.video.video_duration/60)+":"+ this.video.video_duration%60
        }
      }
      let today = new Date()
      if(today.getFullYear() > this.video.year){
        this.dateDetail = "<p>" + (today.getFullYear() - this.video.year) +" year ago</p>"
      }
      else if(today.getMonth()+1 > this.video.month){
        this.dateDetail = "<p>" + (today.getMonth()+1 - this.video.month) +" month ago</p>"
      }
      else if(today.getDate() > this.video.day){
        this.dateDetail = "<p>" + (today.getDate() - this.video.day) +" day ago</p>"
      }
      else if(today.getHours() > this.video.hour){
        this.dateDetail = "<p>" + (today.getHours() - this.video.hour) +" hour ago</p>"
      }
      else if(today.getMinutes() > this.video.minute){
        this.dateDetail = "<p>" + (today.getMinutes() - this.video.minute) +" minute ago</p>"
      }
      else if(today.getSeconds() > this.video.second && (today.getSeconds() - this.video.second) > 10){
        this.dateDetail = "<p>" + (today.getSeconds() - this.video.second) +" seconds ago</p>"
      }
      else{
        this.dateDetail = "<p> Just now</p>"
      }
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
          user_id: this.video.user_id
        }
      }).valueChanges.subscribe(result => {
        this.user = result.data.getUser
      });
    });
  }

  delVideo(video_id){
    this.apollo.mutate({
      mutation: gql `
      mutation deleteList($playlist_id : Int!, $video_id : Int!){
        deleteList(playlist_id : $playlist_id , video_id : $video_id)
      }
      `,
      variables:{
        playlist_id : this.play.playlist_id,
        video_id : video_id
      }
    }).subscribe(result => {
      alert("Delete From Playlist")
      window.location.reload()
    })
  }

}
