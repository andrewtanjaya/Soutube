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

}
