import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-card-channel',
  templateUrl: './card-channel.component.html',
  styleUrls: ['./card-channel.component.sass']
})
export class CardChannelComponent implements OnInit {
  id : any;
  user : any
  view : any
  @Input() video : {}
  @Input() i : {}
  constructor(private _Activatedroute:ActivatedRoute , private apollo : Apollo) { }


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

    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('user_id'); 
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
          user_id: this.id
        }
      }).valueChanges.subscribe(result => {
        this.user = result.data.getUser
      })
    });

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
    })
    if(this.video.video_duration/60 < 10){
      if(this.video.video_duration%60 < 10){
        this.durr = "<p>0"+Math.floor(this.video.video_duration/60)+":0"+ this.video.video_duration%60+"</p>"
        // document.getElementById(id).innerHTML = "0"+Math.floor(this.video.video_duration/60)+":0"+ this.video.video_duration%60
      }
      else{
        this.durr = "<p>0"+Math.floor(this.video.video_duration/60)+":"+ this.video.video_duration%60+"</p>"
        // document.getElementById(id).innerHTML = "0"+Math.floor(this.video.video_duration/60)+":"+ this.video.video_duration%60
      }
    }
    else{
      if(this.video.video_duration%60 < 10){
        this.durr = "<p>"+Math.floor(this.video.video_duration/60)+":0"+ this.video.video_duration%60+"</p>"
        // document.getElementById(id).innerHTML = ""+Math.floor(this.video.video_duration/60)+":0"+ this.video.video_duration%60
      }
      else{
        this.durr = "<p>"+Math.floor(this.video.video_duration/60)+":"+ this.video.video_duration%60+"</p>"
        // document.getElementById(id).innerHTML = ""+Math.floor(this.video.video_duration/60)+":"+ this.video.video_duration%60
      }
    }
    let today = new Date()
    if(today.getFullYear() > this.video.year){
      this.dateDetail = "<p>" + (today.getFullYear() - this.video.year) +" year ago</p>"
    }
    else if(today.getMonth()+1 > this.video.month){
      this.dateDetail = "<p>" + (today.getMonth()+ - this.video.month) +" month ago</p>"
    }
    else if(today.getDate() > this.video.day){
      this.dateDetail = "<p>" + (today.getDate() - this.video.day) +" day ago</p>"
    }
    else if(today.getHours() > this.video.hour){
      this.dateDetail = "<p>" + (today.getHours() - this.video.hour) +" hour ago</p>"
    }
    else if(today.getMinutes() > this.video.minute){
      this.dateDetail = "<p>" + (today.getMinutes() - this.video.minute) +" minute ago</p>"
    }
    else if(today.getSeconds() > this.video.second && (today.getSeconds() - this.video.second) > 10){
      this.dateDetail = "<p>" + (today.getSeconds() - this.video.second) +" seconds ago</p>"
    }
    else{
      this.dateDetail = "<p> Just now</p>"
    }
  }

}
