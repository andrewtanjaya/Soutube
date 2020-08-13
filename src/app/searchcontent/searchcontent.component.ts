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
  oriVid : any;
  oriChan : any;
  oriPlay : any;
  find : any
  message : Boolean
  playlists : any
  allchannel : any
  videos : any
  showVid : boolean
  showPlay : boolean
  showChan : boolean
  constructor(private data : DataServiceService,private _Activatedroute : ActivatedRoute,private apollo : Apollo) { }

  ngOnInit(): void {
    document.getElementById("play").checked = true
    document.getElementById("chan").checked = true
    document.getElementById("vid").checked = true
    this.showVid = true
    this.showPlay = true
    this.showChan = true
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
            video_duration
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
          this.oriVid = this.videos.slice();
        })
        this.apollo.watchQuery<any>({
          query: gql `
          query checkChannelLike($user_name : String!){
            checkChannelLike(user_name : $user_name){
              user_name,
              user_id,
              img_url,
              subscriber_count,
              email,
              day,
              month,
              year,
              hour,
              minute,
              second
            }
          }
          `,
          variables :{
            user_name : "%" + this.find +"%"
          }
          }).valueChanges.subscribe(result => {
            this.allchannel = result.data.checkChannelLike
            this.oriChan = this.allchannel.slice()
          })
          this.apollo.watchQuery<any>({
            query: gql `
            query checkPlaylistLike($playlist_name : String!){
              checkPlaylistLike(playlist_name : $playlist_name){
                playlist_name,
                playlist_id,
                user_id,
                description,
                visibility,
                day,
                month,
                year,
                hour,
                minute,
                second
              }
            }
            `,
            variables :{
              playlist_name : "%" + this.find +"%"
            }
            }).valueChanges.subscribe(result => {
              this.playlists = result.data.checkPlaylistLike
              this.playlists = this.playlists.filter(function(playlists){
                return playlists.visibility == "Public"
              })
              this.oriPlay = this.playlists.slice()
            })
    });

  }

  typeVid(){
    if(document.getElementById("vid").checked) {
      this.showVid = true
    }
    else{
      this.showVid = false
    }
    
  }
  typeChan(){
    
    if(document.getElementById("chan").checked) {
      this.showChan = true
    }
    else{
      this.showChan = false
    }
  }

  typePlay(){
    if(document.getElementById("play").checked) {
      this.showPlay = true
    }
    else{
      this.showPlay = false
    }
  }

  week(){
    let now = new Date();
    this.videos = this.oriVid.slice().filter(function(video){
      return video.day >= now.getDate()-7 && video.month == now.getMonth()+1 && video.year == now.getFullYear();
    })
    this.playlists = this.oriPlay.slice().filter(function(video){
      return video.day >= now.getDate()-7 && video.month == now.getMonth()+1 && video.year == now.getFullYear();
    })
    this.allchannel = this.oriChan.slice().filter(function(video){
      return video.day >= now.getDate()-7 && video.month == now.getMonth()+1 && video.year == now.getFullYear();
    })
  }

  month(){
    let now = new Date();
    this.videos = this.oriVid.slice().filter(function(video){
      if(video.month == now.getMonth()+1)
      return true;
      else{
        if((now.getMonth()+1) - video.month > 1){
          return false;
        }else if(((now.getMonth())*30 + now.getDate()) - ((video.month-1)*30 + video.day) <= 30){
          return true
        }
        else{
          return false
        }
      }
      // return video.month == now.getMonth()+1 && video.day <= now.getDate()+30   && video.year == now.getFullYear();
    })
    this.playlists = this.oriPlay.slice().filter(function(video){
      if(video.month == now.getMonth()+1)
      return true;
      else{
        if((now.getMonth()+1) - video.month > 1){
          return false;
        }else if(((now.getMonth())*30 + now.getDate()) - ((video.month-1)*30 + video.day) <= 30){
          return true
        }
        else{
          return false
        }
      }
      // return video.month == now.getMonth()+1 && video.day <= now.getDate()+30   && video.year == now.getFullYear();
    })
    this.allchannel = this.oriChan.slice().filter(function(video){
      if(video.month == now.getMonth()+1)
      return true;
      else{
        if((now.getMonth()+1) - video.month > 1){
          return false;
        }else if(((now.getMonth())*30 + now.getDate()) - ((video.month-1)*30 + video.day) <= 30){
          return true
        }
        else{
          return false
        }
      }
      // return video.month == now.getMonth()+1 && video.day <= now.getDate()+30   && video.year == now.getFullYear();
    })
  }

  year(){
    let now = new Date();
    this.videos = this.oriVid.slice().filter(function(video){
      if(video.year == now.getFullYear())
      return true;
      else{
        if((now.getFullYear()) - video.year > 1){
          return false;
        }else if((now.getFullYear()*365 + now.getMonth()*30 + now.getDate()) - (video.year*365 +(video.month-1)*30 + video.day) <= 365){
          return true
        }
        else{
          return false
        }
      }
      // return video.month == now.getMonth()+1 && video.day <= now.getDate()+30   && video.year == now.getFullYear();
    })
    this.allchannel = this.oriChan.slice().filter(function(video){
      if(video.year == now.getFullYear())
      return true;
      else{
        if((now.getFullYear()) - video.year > 1){
          return false;
        }else if((now.getFullYear()*365 + now.getMonth()*30 + now.getDate()) - (video.year*365 +(video.month-1)*30 + video.day) <= 365){
          return true
        }
        else{
          return false
        }
      }
      // return video.month == now.getMonth()+1 && video.day <= now.getDate()+30   && video.year == now.getFullYear();
    })
    this.playlists = this.oriPlay.slice().filter(function(video){
      if(video.year == now.getFullYear())
      return true;
      else{
        if((now.getFullYear()) - video.year > 1){
          return false;
        }else if((now.getFullYear()*365 + now.getMonth()*30 + now.getDate()) - (video.year*365 +(video.month-1)*30 + video.day) <= 365){
          return true
        }
        else{
          return false
        }
      }
      // return video.month == now.getMonth()+1 && video.day <= now.getDate()+30   && video.year == now.getFullYear();
    })
    
  }

  none(){
    this.videos = this.oriVid.slice();
    this.playlists = this.oriPlay.slice();
    this.allchannel = this.oriChan.slice()
  }
  

}
