import { Component, OnInit, Input } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist-content',
  templateUrl: './playlist-content.component.html',
  styleUrls: ['./playlist-content.component.sass']
})
export class PlaylistContentComponent implements OnInit {
  @Input() play :{}
  message : Boolean;
  user:any;
  constructor(private data : DataServiceService,private _Activatedroute : ActivatedRoute,private apollo : Apollo) { }
  id : any;
  playlist : any
  playlistIdentity : any
  video: any;
  index : any
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
    
    this.data.currentMessage.subscribe(message =>this.message = message);
    this.data.playIndex.subscribe(index =>this.index = index)
    // alert(this.index)
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('playlist_id'); 
      this.getPlaylist();
      this.getPlaylistContent();
      let mat = document.getElementById("vi");
       mat.querySelector("video").addEventListener("ended",
      ()=>{
        if(this.index != -1){
          this.data.changeIndex(this.index+1);
          this.data.playIndex.subscribe(index =>this.index = index)
          this.getVideo();
          mat.src = "{{video.video_url}}"
        }
      }
    );
    });
  }
  getPlaylist(){
    this.apollo.watchQuery<any>({
      query: gql `
      query getPlaylist ($playlist_id : Int!){
        getPlaylist (playlist_id : $playlist_id) {
          playlist_id,
          playlist_name,
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
        playlist_id : this.id
      }
    }).valueChanges.subscribe(result => {
      this.playlistIdentity = result.data.getPlaylist;
      let today = new Date()
        if(today.getFullYear() > this.playlistIdentity.year){
          this.dateDetail = "<p>" + (today.getFullYear() - this.playlistIdentity.year) +" year ago</p>"
        }
        else if(today.getMonth()+1 > this.playlistIdentity.month){
          this.dateDetail = "<p>" + (today.getMonth()+ - this.playlistIdentity.month) +" month ago</p>"
        }
        else if(today.getDate() > this.playlistIdentity.day){
          this.dateDetail = "<p>" + (today.getDate() - this.playlistIdentity.day) +" day ago</p>"
        }
        else if(today.getHours() > this.playlistIdentity.hour){
          this.dateDetail = "<p>" + (today.getHours() - this.playlistIdentity.hour) +" hour ago</p>"
        }
        else if(today.getMinutes() > this.playlistIdentity.minute){
          this.dateDetail = "<p>" + (today.getMinutes() - this.playlistIdentity.minute) +" minute ago</p>"
        }
        else if(today.getSeconds() > this.playlistIdentity.second && (today.getSeconds() - this.playlistIdentity.second) > 10){
          this.dateDetail = "<p>" + (today.getSeconds() - this.playlistIdentity.second) +" seconds ago</p>"
        }
        else{
          this.dateDetail = "<p> Just now</p>"
        }
      console.log(result.data.getPlaylist)
      // alert(this.playlists)
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
          user_id: this.playlistIdentity.user_id
        }
      }).valueChanges.subscribe(result => {
        this.user = result.data.getUser
      });

    });
  }
  
  getPlaylistContent(){
    this.apollo.watchQuery<any>({
      query: gql `
      query getList ($playlist_id : Int!){
        getList(playlist_id : $playlist_id) {
          playlist_id
          list_id
          video_id
        }
      }
      `,
      variables:{
        playlist_id : this.id
      }
    }).valueChanges.subscribe(result => {
      this.playlist = result.data.getList;
      // alert(this.playlists)
      this.getVideo();
    });
  }

  getVideo(){
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
        video_id: this.playlist[this.index].video_id
      }
    }).valueChanges.subscribe(result => {
      this.video = result.data.getVideo;
    });
  }

  geturl(index) : any{
    alert(index)
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
        video_id: this.playlist[index].video_id
      }
    }).valueChanges.subscribe(result => {
      this.video = result.data.getVideo
      alert(this.video.video_url)
      return this.video.video_url;
    });
  }
}
