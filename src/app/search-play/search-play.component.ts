import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { PlaylistContentComponent } from '../playlist-content/playlist-content.component';

@Component({
  selector: 'app-search-play',
  templateUrl: './search-play.component.html',
  styleUrls: ['./search-play.component.sass']
})
export class SearchPlayComponent implements OnInit {
@Input() play: {playlist_id : number,playlist_name : String,user_id : number,description : String}
playlist : any
user: any
haveSaved : Boolean
video:any;
curUser : any;
emailnya : any;
a : any;
b : any;
saved : any;
  constructor( private apollo : Apollo) { }

  ngOnInit(): void {
    this.emailnya = JSON.parse(localStorage.getItem("users"))[0]
    this.haveSaved = false
    

    console.log(this.emailnya)
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
      email: this.emailnya.email
      }
      }).valueChanges.subscribe(result => {
      this.curUser = result.data.getUserId
      this.apollo.watchQuery<any>({
        query: gql `
        query getSavedPlaylist($user_id: Int!){
          getSavedPlaylist(user_id : $user_id) {
            user_id,
            playlist_id,
            }
          }
        `,
        variables:{
        user_id: this.curUser.user_id
        }
        }).valueChanges.subscribe(result => {
          this.a = result.data.getSavedPlaylist
          for(let c = 0;this.a[c];c++){
            if(this.a[c].playlist_id == this.play.playlist_id) this.haveSaved = true

            console.log("HOHOHO")
            console.log(c)
            // this.apollo.watchQuery<any>({
            //   query: gql `
            //   query getPlaylist($playlist_id: Int!){
            //     getPlaylist(playlist_id : $playlist_id) {
            //       playlist_id,
            //       playlist_name,
            //       visibility,
            //       }
            //     }
            //   `,
            //   variables:{
            //   playlist_id: this.a[c].playlist_id
            //   }
            //   }).valueChanges.subscribe(result => {
            //   this.b = result.data.getPlaylist
              
            //   if(!this.saved){
            //     this.saved = this.b
            //   }
            //   else{
            //     this.saved.push(this.b)
            //   }

              
            //   })

              
          }
        })
      })
    this.apollo.watchQuery<any>({
      query: gql `
      query getList ($playlist_id : Int!){
        getList(playlist_id : $playlist_id) {
          playlist_id,
          list_id,
          video_id,
        }
      }
      `,
      variables:{
        playlist_id : this.play.playlist_id
      }
    }).valueChanges.subscribe(result => {
      this.playlist = result.data.getList;
      // alert(this.playlist.video_id)
      // alert(this.playlists)
      let today = new Date()
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
            video_duration,
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
          video_id: this.playlist[0].video_id
        }
      }).valueChanges.subscribe(result => {      
        this.video = result.data.getVideo;

      

      
      });
    });

    this.apollo.watchQuery({
      query: gql `
        query getUser($user_id : Int!){
          getUser(user_id : $user_id) {
            user_id
            user_name
            membership
            img_url
          }
        }
      `,
      variables:{
        user_id: this.play.user_id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
    });
  }

  
  savePlay(id){
    this.apollo.mutate({
      mutation: gql `
      mutation createSave ($playlist_id : Int! , $user_id : Int!){
        createSave(
          input : {
            playlist_id : $playlist_id,
            user_id : $user_id
          }
        ){
          
          user_id,
          playlist_id
        }
      }
      `,
      variables:{
        playlist_id : id,
        user_id : this.curUser.user_id,
      },
      refetchQueries:[{
        query: gql `
            query getSavedPlaylist($user_id : Int!){
              getSavedPlaylist(user_id : $user_id) {
                
                user_id,
                playlist_id
              }
            }
          `,
          variables:{
            user_id: this.curUser.user_id
          }
      }]
    }).subscribe(result => {
      alert("Saved")
      window.location.reload()
    })
  }

  
}
