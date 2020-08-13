import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DataServiceService } from '../data-service.service';
import gql from 'graphql-tag';

@Component({
  selector: 'app-gaming-cat-detail',
  templateUrl: './gaming-cat-detail.component.html',
  styleUrls: ['./gaming-cat-detail.component.sass']
})
export class GamingCatDetailComponent implements OnInit {

  videos : any
  message : Boolean;
  videoFiltered : any
  week : any;
  months : any;
  recently : any;
  
  constructor(private data : DataServiceService ,private apollo : Apollo) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message =>this.message = message)
    this.apollo
    .watchQuery({
      query: gql`
        {
          videos{
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
            user_id
            video_duration
            day
            month
            year
            hour
            minute
            second
          }
        }
      `,
    })
    .valueChanges.subscribe(result => {
      this.videos = result.data.videos;

      this.videoFiltered = this.videos.filter(function(video){
        return video.video_cat == "Game"
      })
      this.videoFiltered = this.videoFiltered.sort((a,b) =>
      a.view_count < b.view_count ? 1 : -1
      )
      this.recently = this.videos.filter(function(video){
        return video.video_cat == "Game"
      })
      this.recently = this.recently.sort((a,b) =>
      ((((a.day*86400)+(a.month*86400*30)+(a.year*86400*30*12)+(a.hour*3600)+(a.minute*60)+(a.second)) < ((b.day*86400)+(b.month*86400*30)+(b.year*86400*30*12)+(b.hour*3600)+(b.minute*60)+(b.second))) ? 1 : -1)
    )


      let now = new Date()
      // this.today = this.videoFiltered.filter(function(video){
      //   // return ((video.day*86400)+(video.month*86400*30)+(video.year*86400*30*12)+(video.hour*3600)+(video.minute*60)+(video.second)) - ((now.getDate()*86400)+((now.getMonth()+1)*86400*30)+(now.getFullYear()*86400*30*12)+(now.getHours()*3600)+(now.getMinutes()*60)+(now.getSeconds())) < 86400
      //   return video.day == now.getDate() && video.month == now.getMonth()+1 && video.year == now.getFullYear();
      // })
      // this.today = this.today.sort((a,b) =>
      //   ((((a.day*86400)+(a.month*86400*30)+(a.year*86400*30*12)+(a.hour*3600)+(a.minute*60)+(a.second)) < ((b.day*86400)+(b.month*86400*30)+(b.year*86400*30*12)+(b.hour*3600)+(b.minute*60)+(b.second))) ? 1 : -1)
      // )
      this.week = this.videoFiltered.filter(function(video){
        return video.day >= now.getDate()-7 && video.month == now.getMonth()+1 && video.year == now.getFullYear();
      })
      this.week = this.week.sort((a,b) =>
      a.view_count < b.view_count ? 1 : -1
    )
      this.months = this.videoFiltered.filter(function(video){
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
      a.view_count < b.view_count ? 1 : -1
      )
  });
}

getviewcount(video_id){
  let view : any;
  this.apollo.watchQuery<any>({
    query: gql `
    query getView($video_id : Int!){
      getView(video_id : $video_id){
        view_id,
        video_id,
        view_count,
        user_id,
      }
    }
    `,
    variables:{
      video_id : video_id
    }
  }).valueChanges.subscribe(result => {
    view = result.data.getView
    return view.length
  })
}
}
