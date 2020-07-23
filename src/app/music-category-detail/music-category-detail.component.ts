import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-music-category-detail',
  templateUrl: './music-category-detail.component.html',
  styleUrls: ['./music-category-detail.component.sass']
})
export class MusicCategoryDetailComponent implements OnInit {
  videos : any
  message : Boolean;
  videoFiltered : any
  videoSorted : any
  constructor(private data : DataServiceService,private apollo : Apollo) { }

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
      
      // this.videos.sort((a,b)=>
      //   ((this.getviewcount(a.video_id).length < this.getviewcount(b.video_id).length) ? 1 : -1)
      // )

      this.videoFiltered = this.videos.filter(function(video){
        return video.video_cat == "Music"
      })

  });
}

getviewcount(video_id : number) : any{
  console.log(video_id)
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
    console.log(view)
    return view
  })
}
}
