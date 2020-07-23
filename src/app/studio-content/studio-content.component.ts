import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-studio-content',
  templateUrl: './studio-content.component.html',
  styleUrls: ['./studio-content.component.sass']
})
export class StudioContentComponent implements OnInit {
videos : any
curEmail : any
currentUser : any
  constructor(private data : DataServiceService, private apollo : Apollo) { }

  ngOnInit(): void {
    this.data.changeMessage(false);
    this.curEmail = JSON.parse(localStorage.getItem("users"))[0].email
    this.apollo.watchQuery<any>({
      query: gql `
      query getUserId($email: String!){
      getUserId(email : $email) {
          user_id,
          user_name,
          membership,
          img_url,
          }
        }
      `,
      variables:{
      email: this.curEmail
      }
      }).valueChanges.subscribe(result => {
      this.currentUser = result.data.getUserId
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
              second,
            }
          }
          `,
          variables:{
            user_id : this.currentUser.user_id
          }
        }).valueChanges.subscribe(result => {
          this.videos = result.data.getVideoUser;
        });
      })
    
  }

}
