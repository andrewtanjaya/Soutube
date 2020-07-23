import { Component, OnInit, Input } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-entertainmentcatdetail',
  templateUrl: './entertainmentcatdetail.component.html',
  styleUrls: ['./entertainmentcatdetail.component.sass']
})
export class EntertainmentcatdetailComponent implements OnInit {
  @Input() video : {}
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
        return video.video_cat == "Entertainment"
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
