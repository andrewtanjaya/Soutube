import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-edit-video-content',
  templateUrl: './edit-video-content.component.html',
  styleUrls: ['./edit-video-content.component.sass']
})
export class EditVideoContentComponent implements OnInit {
  message : Boolean
  id : any
  video : any
  constructor(private data : DataServiceService, private _Activatedroute : ActivatedRoute,private apollo : Apollo, private router : Router) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message =>this.message = message)
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('video_id'); 
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
          video_duration,
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
      this.video = result.data.getVideo
      console.log(this.video)
      if(this.video.age_restriction == "Yes"){
        document.getElementsByName("age")[0].checked = "true"
      }
      else{
        document.getElementsByName("age")[1].checked = "true"
      }
      document.getElementById("country").value = this.video.location_video
      document.getElementById("cat").value = this.video.video_cat
      if(this.video.visibility == "Public"){
        console.log("masuk")
        document.getElementsByName("save")[0].checked = "true"
      }
        
      else if(this.video.visibility == "Private")
        document.getElementsByName("save")[1].checked = "true"
      else
        document.getElementsByName("save")[2].checked = "true"
      document.getElementsByName("visibility")[0].checked = "true"
      
      if(this.video.premium){
        document.getElementById("pre").checked = "true"
      }
    });
  }
  video_url : String;
  video_title : String;
  video_desc : String;
  video_thumb : String;
  playlist_id : number;
  age_restriction : String;
  location_video : String;
  video_cat : String
  visibility : String;
  premium : String;
  status : String;
  like_count : number;
  dislike_count : number;
  view_count : number;
  user_id : number;
  currentUser : any;

  update(){
    let today = new Date()
    let ins = document.getElementById("inTit");
    this.video_title = ins.value;
    let desc = document.getElementById("inDesc");
    this.video_desc = desc.value;
    let play = document.getElementById("inPlay");
    this.playlist_id = play.value
    let age = document.getElementsByName("age");
    if(age[0].checked)
      this.age_restriction = "Yes"
    else
      this.age_restriction = "No"
    let loc = document.getElementById("country");
    this.location_video = loc.value;
    let cat = document.getElementById("cat");
    this.video_cat = cat.value;
    let visi = document.getElementsByName("save");
    // cma cek public private ,gbs schedule
    this.status  = "Published"
    if(visi[0].checked) this.visibility = "Public"
    else if(visi[1].checked) this.visibility = "Private"
    else this.visibility = "Unlisted"
    let pre = document.getElementById("pre");
    if(pre.checked) this.premium = "Yes"
    else this.premium = "No"
    console.log(this.video_title)
    console.log(this.video_desc)
    console.log(this.playlist_id)
    console.log(this.age_restriction)
    console.log(this.location_video)
    console.log(this.video_cat)
    console.log(this.status)
    console.log(this.visibility)
    console.log(this.premium)
    console.log(this.video.video_duration)
    console.log(this.video.video_url)
    console.log(this.video.video_thumb)
    console.log(this.video.like_count)
    console.log(this.video.dislike_count)
    console.log(this.video.view_count)
    console.log(this.video.user_id)
    console.log(this.video.video_id)
    console.log(today.getDate())
    console.log(today.getMonth())
    console.log(today.getFullYear())
    console.log(today.getHours())
    console.log(today.getMinutes())
    console.log(today.getSeconds())

    // day : today.getDate(),
    // month : today.getMonth()+1,
    // year : today.getFullYear(),
    // hour : today.getHours(),
    // minute : today.getMinutes(),
    // second : today.getSeconds(),

    this.apollo.mutate({
      mutation: gql `
      mutation updateVideo (
            $id : Int!,
            $video_url : String!,
            $video_title : String!,
            $video_desc : String!,
            $video_cat : String!,
            $video_thumb : String!,
            $playlist_id : Int!,
            $like_count : Int!,
            $dislike_count : Int!,
            $age_restriction : String!,
            $visibility : String!,
            $location_video : String!,
            $status : String!,
            $premium : String!,
            $view_count : Int!,
            $user_id : Int!,
            $video_duration : Int!,
            $day : Int!,
            $month : Int!,
            $year : Int!,
            $hour : Int!,
            $minute : Int!,
            $second : Int!,
      ) {
        updateVideo(
          id : $id,
          input: {
            video_url : $video_url,
            video_title : $video_title,
            video_desc : $video_desc,
            video_cat : $video_cat,
            video_thumb : $video_thumb ,
            playlist_id : $playlist_id,
            like_count : $like_count,
            dislike_count : $dislike_count,
            age_restriction : $age_restriction,
            visibility : $visibility,
            location_video : $location_video,
            status : $status,
            premium : $premium,
            view_count : $view_count,
            user_id : $user_id,
            video_duration : $video_duration,
            day : $day,
            month : $month,
            year : $year,
            hour : $hour,
            minute : $minute,
            second : $second,
          }
        ){
          video_id,
          video_url,
          video_title,
          video_desc,
          video_cat,
          video_thumb,
          playlist_id,
          like_count,
          dislike_count,
          age_restriction,
          visibility,
          location_video,
          status,
          premium,
          view_count,
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
        id : this.video.video_id,
        video_url : this.video.video_url,
        video_title : this.video_title,
        video_desc : this.video_desc,
        video_cat : this.video_cat,
        video_thumb : this.video.video_thumb,
        playlist_id : this.playlist_id,
        like_count : this.video.like_count,
        dislike_count : this.video.dislike_count,
        age_restriction : this.age_restriction,
        visibility : this.visibility,
        location_video : this.location_video,
        status : this.status,
        premium : this.premium,
        view_count : this.video.view_count,
        user_id : this.video.user_id,
        video_duration : this.video.video_duration,
        day : today.getDate(),
        month : today.getMonth()+1,
        year : today.getFullYear(),
        hour : today.getHours(),
        minute : today.getMinutes(),
        second : today.getSeconds(),
        
      },refetchQueries:[{
        query: gql `
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
      `
      }]
    }).subscribe((result) => {

      alert("Video Updated")
      this.router.navigate(["/home"])
    },(error) => {

      console.log('there was an error sending the query', error);
    });
  }
}
