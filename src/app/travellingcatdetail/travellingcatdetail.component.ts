import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-travellingcatdetail',
  templateUrl: './travellingcatdetail.component.html',
  styleUrls: ['./travellingcatdetail.component.sass']
})
export class TravellingcatdetailComponent implements OnInit {
  videos : any
  message : Boolean;
  videoFiltered : any
  
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

      this.videoFiltered = this.videos.filter(function(video){
        return video.video_cat == "Traveling"
      })

    });

  }

}
