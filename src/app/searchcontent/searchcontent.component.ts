import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-searchcontent',
  templateUrl: './searchcontent.component.html',
  styleUrls: ['./searchcontent.component.sass']
})
export class SearchcontentComponent implements OnInit {
  find : any
  message : Boolean
  playlists : any
  allchannel : any
  videos : any
  constructor(private data : DataServiceService,private _Activatedroute : ActivatedRoute,private apollo : Apollo) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message =>this.message = message)
    this._Activatedroute.paramMap.subscribe(params => { 
      this.find = params.get('value'); 

      this.apollo.watchQuery<any>({
        query: gql `
        query getAllVideoLike($video_title : String!) {
          checkVideoLike(video_title : $video_title) {
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
            day
            month
            year
            hour
            minute
            second
          }
        }
        `,
        variables :{
          video_title : "%" + this.find +"%"
        }
        }).valueChanges.subscribe(result => {
          this.videos = result.data.checkVideoLike
          
        })
        this.apollo.watchQuery<any>({
          query: gql `
          query checkChannelLike($user_name : String!){
            checkChannelLike(user_name : $user_name){
              user_name,
              user_id,
              img_url,
              subscriber_count
            }
          }
          `,
          variables :{
            user_name : "%" + this.find +"%"
          }
          }).valueChanges.subscribe(result => {
            this.allchannel = result.data.checkChannelLike
            
          })
          this.apollo.watchQuery<any>({
            query: gql `
            query checkPlaylistLike($playlist_name : String!){
              checkPlaylistLike(playlist_name : $playlist_name){
                playlist_name,
                playlist_id
              }
            }
            `,
            variables :{
              playlist_name : "%" + this.find +"%"
            }
            }).valueChanges.subscribe(result => {
              this.playlists = result.data.checkPlaylistLike
            })
    });

  }

}
