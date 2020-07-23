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

  convertMetricNumber(num: number): string {
    for(let i: number = 0; i < this.ranges.length; i++){
      if(num >= this.ranges[i].divider){
        return Math.floor((num / this.ranges[i].divider)).toString() + this.ranges[i].suffix
      }
    }

    return num.toString();
  } 

  ranges = [
    { divider: 1e18 , suffix: 'E' },
    { divider: 1e15 , suffix: 'P' },
    { divider: 1e12 , suffix: 'T' },
    { divider: 1e9 , suffix: 'B' },
    { divider: 1e6 , suffix: 'M' },
    { divider: 1e3 , suffix: 'k' }
  ];
  
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
