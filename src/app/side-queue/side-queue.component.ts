import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-side-queue',
  templateUrl: './side-queue.component.html',
  styleUrls: ['./side-queue.component.sass']
})
export class SideQueueComponent implements OnInit {
  user : any
  view : any
  id : any
  rand : number
  related : any
  videos : any
  observer : any
  lastIndex = 4
  video : any
  constructor(private apollo : Apollo, private _Activatedroute : ActivatedRoute, private data : DataServiceService) { }

  ngOnInit(): void {
    this.rand = -1
    this.observer = new IntersectionObserver((entry)=>{
      if(entry[0].isIntersecting){
        let card = document.querySelector(".queue");
        for(let i:number=0;i<4;i++){
          if(this.lastIndex < this.videos.length){
            let div = document.createElement("div");
            let video = document.createElement("app-cardside")
            video.setAttribute("video","this.videos[this.lastIndex]");
            div.appendChild(video);
            card.appendChild(div);
            this.lastIndex++
          }
        }
      }
    });
    this.observer.observe(document.querySelector(".footere"));

    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('vidId'); 
    });

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
        video_id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.video = result.data.getVideo;
      this.apollo.watchQuery<any>({
        query: gql `
        query getRelated($video_cat : String! , $location_video : String!) {
          getRelated(video_cat : $video_cat , location_video : $location_video) {
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
          video_cat : this.video.video_cat,
          location_video : this.video.location_video
        }
      }).valueChanges.subscribe(result => {
        this.related = result.data.getRelated
        if(this.related.length == 1){
          this.apollo.watchQuery<any>({
            query: gql `
            query getRelatedCat($video_cat : String!) {
              getRelatedCat(video_cat : $video_cat) {
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
              video_cat : this.video.video_cat,
            }
          }).valueChanges.subscribe(result => {
            this.related = result.data.getRelatedCat
            if(this.related.length == 1){
              this.apollo
              .watchQuery<any>({
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
                      day
                      month
                      year
                      video_duration
                      hour
                      minute
                      second
                    }
                  }
                `,
              })
              .valueChanges.subscribe(result => {
                this.videos = result.data.videos;
                
                this.related = this.videos
                this.rand = Math.floor(Math.random() * Math.floor(this.related.length));
                while(this.rand == this.id){
                  this.rand = Math.floor(Math.random() * Math.floor(this.related.length));
                }
                this.getUser(this.related[this.rand].user_id)
                this.getView(this.related[this.rand].video_id)
                this.getDate(this.related[this.rand].day,this.related[this.rand].month,this.related[this.rand].year,this.related[this.rand].hour,this.related[this.rand].minute,this.related[this.rand].second)
                this.getDur(this.related[this.rand].video_duration)
                if(document.getElementById("next").checked)
                this.data.changeQ(this.related[this.rand].video_id)
              else{
                this.data.changeQ(-1)
              }
              });
            }
            else{
              this.rand = Math.floor(Math.random() * Math.floor(this.related.length));
              while(this.rand == this.id){
                this.rand = Math.floor(Math.random() * Math.floor(this.related.length));
              }
              this.getUser(this.related[this.rand].user_id)
              this.getView(this.related[this.rand].video_id)
              this.getDate(this.related[this.rand].day,this.related[this.rand].month,this.related[this.rand].year,this.related[this.rand].hour,this.related[this.rand].minute,this.related[this.rand].second)
              this.getDur(this.related[this.rand].video_duration)
              if(document.getElementById("next").checked)
                this.data.changeQ(this.related[this.rand].video_id)
              else{
                this.data.changeQ(-1)
              }
            }
            
          })  
        }
        else{
          this.rand = Math.floor(Math.random() * Math.floor(this.related.length));
          while(this.rand == this.id){
                  this.rand = Math.floor(Math.random() * Math.floor(this.related.length-1));
          }
          this.getUser(this.related[this.rand].user_id)
          this.getView(this.related[this.rand].video_id)
          this.getDate(this.related[this.rand].day,this.related[this.rand].month,this.related[this.rand].year,this.related[this.rand].hour,this.related[this.rand].minute,this.related[this.rand].second)
          this.getDur(this.related[this.rand].video_duration)
          if(document.getElementById("next").checked)
                this.data.changeQ(this.related[this.rand].video_id)
              else{
                this.data.changeQ(-1)
              }
        }

      })  
    })
    
    this.apollo
              .watchQuery<any>({
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
                      day
                      month
                      year
                      video_duration
                      hour
                      minute
                      second
                    }
                  }
                `,
              })
              .valueChanges.subscribe(result => {
                this.videos = result.data.videos;
               
              });
      


  }
  toggle(){
    if(document.getElementById("next").checked){
      // alert('send')
      this.data.changeQ(this.related[this.rand].video_id)
    } 
      else{
        // alert("not")
            this.data.changeQ(-1)
      }
        
  }

  getDur(video_duration){
    if(video_duration/60 < 10){
      if(video_duration%60 < 10){
        this.durr = "<p>0"+Math.floor(video_duration/60)+":0"+ video_duration%60+"</p>"
        // document.getElementById(id).innerHTML = "0"+Math.floor(this.video.video_duration/60)+":0"+ this.video.video_duration%60
      }
      else{
        this.durr = "<p>0"+Math.floor(video_duration/60)+":"+ video_duration%60+"</p>"
        // document.getElementById(id).innerHTML = "0"+Math.floor(this.video.video_duration/60)+":"+ this.video.video_duration%60
      }
    }
    else{
      if(video_duration%60 < 10){
        this.durr = "<p>"+Math.floor(video_duration/60)+":0"+ video_duration%60+"</p>"
        // document.getElementById(id).innerHTML = ""+Math.floor(this.video.video_duration/60)+":0"+ this.video.video_duration%60
      }
      else{
        this.durr = "<p>"+Math.floor(video_duration/60)+":"+ video_duration%60+"</p>"
        // document.getElementById(id).innerHTML = ""+Math.floor(this.video.video_duration/60)+":"+ this.video.video_duration%60
      }
    }
  }
  getDate(day,month,year,hour,minute,second){
    let today = new Date()
    if(today.getFullYear() > year){
      this.dateDetail = "<p>" + (today.getFullYear() - year) +" year ago</p>"
    }
    else if(today.getMonth()+1 >month){
      this.dateDetail = "<p>" + (today.getMonth()+ - month) +" month ago</p>"
    }
    else if(today.getDate() > day){
      this.dateDetail = "<p>" + (today.getDate() - day) +" day ago</p>"
    }
    else if(today.getHours() > hour){
      this.dateDetail = "<p>" + (today.getHours() - hour) +" hour ago</p>"
    }
    else if(today.getMinutes() > minute){
      this.dateDetail = "<p>" + (today.getMinutes() - minute) +" minute ago</p>"
    }
    else if(today.getSeconds() > second && (today.getSeconds() - second) > 10){
      this.dateDetail = "<p>" + (today.getSeconds() - second) +" seconds ago</p>"
    }
    else{
      this.dateDetail = "<p> Just now</p>"
    }
  }

  getView(video_id){
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
        video_id : video_id
      }
    }).valueChanges.subscribe(result => {
      this.view = result.data.getView
    });
  }

  getUser(user_id){
    this.apollo.watchQuery<any>({
      query: gql `
        query getUser($user_id : Int!){
          getUser(user_id : $user_id) {
            user_id,
            user_name,
            membership,
            img_url,
            subscriber_count
          }
        }
      `,
      variables:{
        user_id: user_id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
    });
  }

}
