import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-studiocard',
  templateUrl: './studiocard.component.html',
  styleUrls: ['./studiocard.component.sass']
})
export class StudiocardComponent implements OnInit {
  @Input() video :{}
  percent : number;
  likedVideo : any;
  dislikedVideo : any;
  view : any
  comments : any;
  currentUser : any;
  curEmail : any;
  constructor( private apollo : Apollo) { }

  ngOnInit(): void {
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
    });

    this.apollo.watchQuery<any>({
      query: gql `
      query getComment($video_id : Int!){
        getComment(video_id : $video_id){
          comment_id,
          user_id,
          video_id,
          comment,
          like_count,
          dislike_count,
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
        video_id : this.video.video_id
      }
    }).valueChanges.subscribe(result => {
      this.comments = result.data.getComment
    })

    this.apollo.watchQuery<any>({
      query: gql `
      query getLikedVideo($video_id : Int!){
        getLikedVideo(video_id : $video_id){
          like_id,
          user_id,
          video_id,
        }
      }
      `,
      variables:{
        video_id : this.video.video_id
      }
    }).valueChanges.subscribe(result => {
      this.likedVideo = result.data.getLikedVideo
      this.apollo.watchQuery<any>({
        query: gql `
        query getDislikedVideo($video_id : Int!){
          getDislikedVideo(video_id : $video_id){
            dislike_id,
            user_id,
            video_id,
          }
        }
        `,
        variables:{
          video_id : this.video.video_id
        }
      }).valueChanges.subscribe(result => {
        this.dislikedVideo = result.data.getDislikedVideo

        if((this.likedVideo.length+this.dislikedVideo.length) !=0){
          this.percent = (this.likedVideo.length/(this.likedVideo.length + this.dislikedVideo.length))*100
          document.getElementById("progressLike"+this.video.video_id).setAttribute("style", "width : "+this.percent+"px")
        }
          
        else{
          document.getElementById("progressLike"+this.video.video_id).setAttribute("style", "width : 0px")
          this.percent = 0
        } 
      });


    })
    
  }


  delVideo(video_id){
    this.apollo.mutate({
      mutation: gql `
      mutation deleteVideo($video_id : Int!){
        deleteVideo(id : $video_id )
      }
      `,
      variables:{
        video_id : video_id
      },
      refetchQueries:[{
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
      }]
    }).subscribe(result => {
      alert("Deleted Video")
    })
  }

}
