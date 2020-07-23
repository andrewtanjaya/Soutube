import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-cardside',
  templateUrl: './cardside.component.html',
  styleUrls: ['./cardside.component.sass']
})
export class CardsideComponent implements OnInit {
  @Input() video 
  view : any
  user : any
  constructor(private apollo : Apollo) { }

  ngOnInit(): void {
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
        video_id : this.video.video_id
      }
    }).valueChanges.subscribe(result => {
      this.view = result.data.getView
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
      })
    })
  }

  refresh(){
    window.location.reload()
  }

}
