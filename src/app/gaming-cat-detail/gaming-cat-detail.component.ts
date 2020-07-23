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
      this.videoFiltered.sort((a,b)=>
      (this.getviewcount(a.video_id) < this.getviewcount(b.video_id)) ? 1 : -1
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
