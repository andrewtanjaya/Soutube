import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-trend-content',
  templateUrl: './trend-content.component.html',
  styleUrls: ['./trend-content.component.sass']
})
export class TrendContentComponent implements OnInit {
  message : Boolean;
  videos : any;
  view : any;
  constructor(private data : DataServiceService, private apollo : Apollo) { }

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
        let now = new Date()
        this.videos = result.data.videos;
        this.videos = this.videos.filter(function(video){
          return video.day >= now.getDate()-7 && video.month == now.getMonth()+1 && video.year == now.getFullYear();
        })
        this.videos = this.videos.sort((a,b)=>
          (a.view_count < b.view_count ) ? 1 : -1
        )
      });
  }

  

}
