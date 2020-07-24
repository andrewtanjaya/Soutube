import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-search-play',
  templateUrl: './search-play.component.html',
  styleUrls: ['./search-play.component.sass']
})
export class SearchPlayComponent implements OnInit {
@Input() play: {playlist_id : number,playlist_name : String,user_id : number}
playlist : any
user: any
  constructor( private apollo : Apollo) { }

  ngOnInit(): void {
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
        playlist_id : this.play.playlist_id
      }
    }).valueChanges.subscribe(result => {
      this.playlist = result.data.getList;
      // alert(this.playlists)
      
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

  
  

  
}
