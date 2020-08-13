import { Component, OnInit, Input } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-playlist-content',
  templateUrl: './playlist-content.component.html',
  styleUrls: ['./playlist-content.component.sass']
})
export class PlaylistContentComponent implements OnInit {
  @Input() play :{}
  a : any;
  haveSaved : Boolean
  curUserAll : any;
  doneSubbed : Boolean
  subbedChannel : any;
  edit : Boolean
  reversed : Boolean
  sortedPl : any;
  sortPublished : Boolean
  message : Boolean;
  user:any;
  sortedView : Boolean;
  constructor(private data : DataServiceService,private _Activatedroute : ActivatedRoute,private apollo : Apollo) { }
  id : any;
  playlist : any
  playlistIdentity : any
  video: any;
  index : any
  showShare : Boolean
  plq : any;
  link : String
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
    this.link = window.location.href
    // document.getElementById("plname").value = this.playlistIdentity.playlist_name
    this.showShare = false;
    this.edit = false
    document.addEventListener("click", (evt) => {
      const flyoutElement = document.getElementById("sho");
      let targetElement = evt.target; // clicked element
  
      do {
          if (targetElement == flyoutElement) {
              // Do nothing, just return.
              this.showShare = true
              return;
          }
          // Go up the DOM.
          targetElement = targetElement.parentNode;
      } while (targetElement);
  
      this.showShare = false;
  });
    this.sortView = false;
    this.doneSubbed = false;
    this.sortPublished = false;
    this.reversed = false
    this.edit = false;
    this.data.currentMessage.subscribe(message =>this.message = message);
    this.data.playIndex.subscribe(index =>this.index = index)
    this.data.plq.subscribe(plq => this.plq = plq)
    // alert(this.index)
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('playlist_id'); 
      this.getPlaylist();
      
      // let mat = document.getElementById("vi"); 
    //    mat.querySelector("video").addEventListener("ended",
    //   ()=>{
    //     if(this.index != -1){
    //       this.data.changeIndex(this.index+1);
    //       this.data.playIndex.subscribe(index =>this.index = index)
    //       this.getVideo();
    //       mat.src = "{{video.video_url}}"
    //     }
    //   }
    // );
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
          description,
          visibility,
          day,
          month,
          year,
          hour,
          minute,
          second
          sortby
        }
      }
      `,
      variables:{
        playlist_id : this.id
      }
    }).valueChanges.subscribe(result => {
      this.playlistIdentity = result.data.getPlaylist;
      if(this.playlistIdentity.description){
        document.getElementById("des").value = this.playlistIdentity.description;
      }

      document.getElementById("visi").value = this.playlistIdentity.visibility
      // alert(this.playlistIdentity.visibility)
      let today = new Date()
        if(today.getFullYear() > this.playlistIdentity.year){
          this.dateDetail = "<p>" + (today.getFullYear() - this.playlistIdentity.year) +" year ago</p>"
        }
        else if(today.getMonth()+1 > this.playlistIdentity.month){
          this.dateDetail = "<p>" + (today.getMonth()+1 - this.playlistIdentity.month) +" month ago</p>"
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
        
      this.getPlaylistContent();
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
        if(localStorage.getItem("users")){
          this.apollo.watchQuery<any>({
            query: gql `
            query getUserId ($email : String!) {
              getUserId(email: $email) {
                user_id,
                user_name,
                membership,
                email,
                
              }
            }
            `,
            variables:{
                email : JSON.parse(localStorage.getItem("users"))[0].email,
            }
          }).valueChanges.subscribe(result => {
            // alert(this.comment.comment_id)
            this.curUserAll = result.data.getUserId
            this.checkSubbed()
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
              user_id: this.curUserAll.user_id
              }
              }).valueChanges.subscribe(result => {
                this.a = result.data.getSavedPlaylist
                for(let c = 0;this.a[c];c++){
                  if(this.a[c].playlist_id == this.id) this.haveSaved = true
      
                  console.log("HOHOHO")
                  console.log(c)  
                }
                if(this.playlistIdentity.sortby == 3){
                  this.sortedPl = this.playlist.slice().sort((a,b) =>
                    a.video_id > b.video_id ? -1 : 1
                  )
                  localStorage.setItem("queue",JSON.stringify(this.sortedPl))
                }
                else if(this.playlistIdentity.sortby == 4){
                  this.sortPublished = true
                  this.sortedPl = this.playlist.slice().sort((a,b) =>
                    a.video_id < b.video_id ? -1 : 1
                  )
                  localStorage.setItem("queue",JSON.stringify(this.sortedPl))
                }
                else if(this.playlistIdentity.sortby == 1){
                  // alert("1");
                  this.sortedPl = this.playlist.slice().sort((a,b) =>
                    a.list_id < b.list_id ? -1 : 1
                  )
                  localStorage.setItem("queue",JSON.stringify(this.sortedPl))
                }
                else if(this.playlistIdentity.sortby == 2){
                  this.reversed = true
                  this.sortedPl = this.playlist.slice().sort((a,b) =>
                    a.list_id > b.list_id ? -1 : 1
                  )
                  localStorage.setItem("queue",JSON.stringify(this.sortedPl))
                }
                else if(this.playlistIdentity.sortby == 5){
                  this.sortView();
                }
              })
          });
      }

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
      this.sortedPl = this.playlist
      this.data.changePlay(this.sortedPl);
      // alert(this.playlists)
      if(this.playlist)
        this.getVideo(0);
    });
  }

  getVideo(index){
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
      this.video = result.data.getVideo;
    });
  }

  geturl(video_id) : any{
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
        video_id: video_id
      }
    }).valueChanges.subscribe(result => {
      return result.data.getVideo
    });
  }

  addDesc(){
    let des :String
    let visi : String
    let name : String
    if(document.getElementById("plname")){
      name =  document.getElementById("plname").value
    }
    else{ 
      name = this.playlistIdentity.playlist_name
    }
    visi = document.getElementById("visi").value;
    des = document.getElementById("des").value;
    let today = new Date();
    this.apollo.mutate({
      mutation: gql `
      mutation updatePlaylist (
            $id : Int!,
            $playlist_name : String!,
            $user_id : Int!,
            $visibility : String!,
            $description : String!,
            $day : Int!,
            $month : Int!,
            $year : Int!,
            $hour : Int!,
            $minute : Int!,
            $second : Int!,
      ) {
        updatePlaylist(
          id : $id,
          input: {
            playlist_name : $playlist_name,
            user_id : $user_id,
            visibility : $visibility,
            description : $description,
            day : $day,
            month : $month,
            year : $year,
            hour : $hour,
            minute : $minute,
            second : $second,
          }
        ){
          playlist_name,
          user_id
          visibility,
          description,
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
        id : this.playlistIdentity.playlist_id,
        playlist_name : name,
        user_id : this.playlistIdentity.user_id,
        visibility : visi,
        description : des,
        day : today.getDate(),
        month : today.getMonth()+1,
        year : today.getFullYear(),
        hour : today.getHours(),
        minute : today.getMinutes(),
        second : today.getSeconds(),
        
      }
    }).subscribe((result) => {
      this.playlistIdentity = result.data.updatePlaylist;
      alert("Playlist Updated")
      if(this.playlistIdentity.description){
        document.getElementById("des").value = this.playlistIdentity.description;
      }

      document.getElementById("visi").value = this.playlistIdentity.visibility

      document.getElementById("tot").style.display ="block"
      document.getElementById("tot").innerText = this.playlistIdentity.playlist_name 
      this.edit = false
      let today = new Date()
        if(today.getFullYear() > this.playlistIdentity.year){
          this.dateDetail = "<p>" + (today.getFullYear() - this.playlistIdentity.year) +" year ago</p>"
        }
        else if(today.getMonth()+1 > this.playlistIdentity.month){
          this.dateDetail = "<p>" + (today.getMonth()+1 - this.playlistIdentity.month) +" month ago</p>"
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
    },(error) => {

      console.log('there was an error sending the query', error);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sortedPl, event.previousIndex, event.currentIndex);

    // let a  = this.playlist[event.previousIndex] 
    // this.playlist[event.previousIndex] = this.playlist[event.currentIndex];
    // this.playlist[event.currentIndex] = a;
    this.data.changePlay(this.sortedPl);
    // console.log(this.plq)
  }

  rmVideos(){
    this.apollo.mutate({
      mutation: gql `
      mutation deleteAllListVideo($playlist_id : Int!){
        deleteAllListVideo(playlist_id : $playlist_id)
      }
      `,
      variables:{
        playlist_id : this.id,
      }
    }).subscribe(result => {
      alert("All Videos Deleted From Playlist")
      window.location.reload()
    })
  }

  rmPlay(){
    this.apollo.mutate({
      mutation: gql `
      mutation deletePlaylist($playlist_id : Int!){
        deletePlaylist(playlist_id : $playlist_id)
      }
      `,
      variables:{
        playlist_id : this.id,
      }
    }).subscribe(result => {
      alert("Playlist Deleted")
      window.location.href = "/home"
    })
  }

  toggleEdit(){
    this.edit = !this.edit
    document.getElementById("plname").value = this.playlistIdentity.playlist_name
  }

  sortView(){

  }

  sortAdded(){
    if(!this.reversed){
      
      this.sortedPl = this.playlist.slice().sort((a,b) =>
      a.list_id < b.list_id ? -1 : 1
    ) 
    console.log(this.sortedPl)
      this.reversed = true
      this.apollo.mutate({
        mutation: gql `
        mutation updatePlaylist (
              $id : Int!,
              $playlist_name : String!,
              $user_id : Int!,
              $visibility : String!,
              $description : String!,
              $day : Int!,
              $month : Int!,
              $year : Int!,
              $hour : Int!,
              $minute : Int!,
              $second : Int!,
              $sortby : Int!
        ) {
          updatePlaylist(
            id : $id,
            input: {
              playlist_name : $playlist_name,
              user_id : $user_id,
              visibility : $visibility,
              description : $description,
              day : $day,
              month : $month,
              year : $year,
              hour : $hour,
              minute : $minute,
              second : $second,
              sortby : $sortby
            }
          ){
            playlist_name,
            user_id
            visibility,
            description,
            day,
            month,
            year,
            hour,
            minute,
            second,
            sortby
          }
        } 
        `,
        variables:{
          id : this.playlistIdentity.playlist_id,
          playlist_name : this.playlistIdentity.playlist_name,
          user_id : this.playlistIdentity.user_id,
          visibility : this.playlistIdentity.visibility,
          description : this.playlistIdentity.description,
          day : this.playlistIdentity.day,
          month : this.playlistIdentity.month,
          year : this.playlistIdentity.year,
          hour : this.playlistIdentity.hour,
          minute : this.playlistIdentity.minute,
          second : this.playlistIdentity.second,
          sortby : 2
        }
      }).subscribe((result) => {
        this.playlistIdentity = result.data.updatePlaylist
        // alert("Sorted")
      });
    }
    else{
      // alert("balik balik")
      this.sortedPl = this.playlist.slice().sort((a,b) =>
      a.list_id > b.list_id ? -1 : 1
    )
    console.log(this.sortedPl)
    this.apollo.mutate({
      mutation: gql `
      mutation updatePlaylist (
            $id : Int!,
            $playlist_name : String!,
            $user_id : Int!,
            $visibility : String!,
            $description : String!,
            $day : Int!,
            $month : Int!,
            $year : Int!,
            $hour : Int!,
            $minute : Int!,
            $second : Int!,
            $sortby : Int!
      ) {
        updatePlaylist(
          id : $id,
          input: {
            playlist_name : $playlist_name,
            user_id : $user_id,
            visibility : $visibility,
            description : $description,
            day : $day,
            month : $month,
            year : $year,
            hour : $hour,
            minute : $minute,
            second : $second,
            sortby : $sortby
          }
        ){
          playlist_name,
          user_id
          visibility,
          description,
          day,
          month,
          year,
          hour,
          minute,
          second,
          sortby
        }
      } 
      `,
      variables:{
        id : this.playlistIdentity.playlist_id,
        playlist_name : this.playlistIdentity.playlist_name,
        user_id : this.playlistIdentity.user_id,
        visibility : this.playlistIdentity.visibility,
        description : this.playlistIdentity.description,
        day : this.playlistIdentity.day,
        month : this.playlistIdentity.month,
        year : this.playlistIdentity.year,
        hour : this.playlistIdentity.hour,
        minute : this.playlistIdentity.minute,
        second : this.playlistIdentity.second,
        sortby : 1
      }
    }).subscribe((result) => {
      this.playlistIdentity = result.data.updatePlaylist
      // alert("Sorted")
    });
      this.reversed = false
    }
    
    this.data.changePlay(this.sortedPl);
    // console.log(this.plq)
  }

  sortPublish(){
    if(this.sortPublished == false){
      this.sortedPl = this.playlist.slice().sort((a,b) =>
            a.video_id > b.video_id ? -1 : 1
          )
          this.sortPublished = true
          this.apollo.mutate({
            mutation: gql `
            mutation updatePlaylist (
                  $id : Int!,
                  $playlist_name : String!,
                  $user_id : Int!,
                  $visibility : String!,
                  $description : String!,
                  $day : Int!,
                  $month : Int!,
                  $year : Int!,
                  $hour : Int!,
                  $minute : Int!,
                  $second : Int!,
                  $sortby : Int!
            ) {
              updatePlaylist(
                id : $id,
                input: {
                  playlist_name : $playlist_name,
                  user_id : $user_id,
                  visibility : $visibility,
                  description : $description,
                  day : $day,
                  month : $month,
                  year : $year,
                  hour : $hour,
                  minute : $minute,
                  second : $second,
                  sortby : $sortby
                }
              ){
                playlist_name,
                user_id
                visibility,
                description,
                day,
                month,
                year,
                hour,
                minute,
                second,
                sortby
              }
            } 
            `,
            variables:{
              id : this.playlistIdentity.playlist_id,
              playlist_name : this.playlistIdentity.playlist_name,
              user_id : this.playlistIdentity.user_id,
              visibility : this.playlistIdentity.visibility,
              description : this.playlistIdentity.description,
              day : this.playlistIdentity.day,
              month : this.playlistIdentity.month,
              year : this.playlistIdentity.year,
              hour : this.playlistIdentity.hour,
              minute : this.playlistIdentity.minute,
              second : this.playlistIdentity.second,
              sortby : 4
            }
          }).subscribe((result) => {
            this.playlistIdentity = result.data.updatePlaylist
            // alert("Sorted")
          });
    }
    else{
      this.sortedPl = this.playlist.slice().sort((a,b) =>
      a.video_id < b.video_id ? -1 : 1
            
          )
          
        this.sortPublished = false
        this.apollo.mutate({
          mutation: gql `
          mutation updatePlaylist (
                $id : Int!,
                $playlist_name : String!,
                $user_id : Int!,
                $visibility : String!,
                $description : String!,
                $day : Int!,
                $month : Int!,
                $year : Int!,
                $hour : Int!,
                $minute : Int!,
                $second : Int!,
                $sortby : Int!
          ) {
            updatePlaylist(
              id : $id,
              input: {
                playlist_name : $playlist_name,
                user_id : $user_id,
                visibility : $visibility,
                description : $description,
                day : $day,
                month : $month,
                year : $year,
                hour : $hour,
                minute : $minute,
                second : $second,
                sortby : $sortby
              }
            ){
              playlist_name,
              user_id
              visibility,
              description,
              day,
              month,
              year,
              hour,
              minute,
              second,
              sortby
            }
          } 
          `,
          variables:{
            id : this.playlistIdentity.playlist_id,
            playlist_name : this.playlistIdentity.playlist_name,
            user_id : this.playlistIdentity.user_id,
            visibility : this.playlistIdentity.visibility,
            description : this.playlistIdentity.description,
            day : this.playlistIdentity.day,
            month : this.playlistIdentity.month,
            year : this.playlistIdentity.year,
            hour : this.playlistIdentity.hour,
            minute : this.playlistIdentity.minute,
            second : this.playlistIdentity.second,
            sortby : 3
          }
        }).subscribe((result) => {
          this.playlistIdentity = result.data.updatePlaylist
          // alert("Sorted")
        });
    }
    this.data.changePlay(this.sortedPl);
    // console.log(this.plq)
  }


  plAll(){
    // this.data.changePlay(this.sortedPl);
    // console.log(this.sortedPl)
    localStorage.setItem("queue",JSON.stringify(this.sortedPl))
    window.location.href = "/videoPlayer/"+this.sortedPl[0].video_id
    
  }

  shuf(){
    localStorage.setItem("queue",JSON.stringify(this.sortedPl))
    window.location.href = "/videoPlayer/" + JSON.parse(localStorage.getItem("queue"))[Math.floor(Math.random() * this.sortedPl.length)].video_id
  }

  loc(){
    localStorage.setItem("queue",JSON.stringify(this.sortedPl))
  }


  checkSubbed(){
    this.apollo.watchQuery<any>({
      query: gql `
      query checkSubs($user_id : Int! , $subscriber_id : Int!) {
        checkSubs(user_id : $user_id , subscriber_id : $subscriber_id) {
          user_id,
          subs_id,
          subscriber_id,
        }
      }
      `,
      variables:{
          user_id : this.user.user_id,
          subscriber_id : this.curUserAll.user_id,
      }
    }).valueChanges.subscribe(result => {
      this.subbedChannel = result.data.checkSubs
      if(this.subbedChannel.subs_id != 0){
        this.doneSubbed = true
      }
      else{
        this.doneSubbed = false
      }
    });
  }

  unSubs(){
    this.apollo.mutate({
      mutation: gql `
      mutation deleteSubs($user_id : Int! , $subscriber_id : Int!){
        deleteSubs(user_id : $user_id , subscriber_id : $subscriber_id)
      }
      `,
      variables:{
        user_id : this.user.user_id,
        subscriber_id : this.curUserAll.user_id
      },
      refetchQueries:[{
        query: gql `
            query getSubscriber($user_id : Int!){
              getSubscriber(user_id : $user_id) {
                subscriber_id,
                user_id,
                subs_id
              }
            }
          `,
          variables:{
            user_id: this.user.user_id
          }
      }]
    }).subscribe(result => {
      alert("Unsubscribed")
      window.location.reload()
    })
  }

  addSubs(){
    if(this.doneSubbed != true){
        this.apollo.mutate({
          mutation: gql `
          mutation createSubs ($user_id : Int! , $subs_id : Int!){
            createSubs(
              input : {
                user_id : $user_id,
                subscriber_id : $subs_id
              }
            ){
              subscriber_id,
              user_id,
              subs_id
            }
          }
          `,
          variables:{
            user_id : this.user.user_id,
            subs_id : this.curUserAll.user_id,
          },
          refetchQueries:[{
            query: gql `
                query getSubscriber($user_id : Int!){
                  getSubscriber(user_id : $user_id) {
                    subscriber_id,
                    user_id,
                    subs_id
                  }
                }
              `,
              variables:{
                user_id: this.user.user_id
              }
          }]
        }).subscribe(result => {
          alert("Subscribed")
          window.location.reload()
        })
    }
    
  }

  rmSaved(){
    this.apollo.mutate({
      mutation: gql `
      mutation deleteSave($playlist_id : Int! , $user_id : Int!){
        deleteSave(playlist_id : $playlist_id , user_id : $user_id)
      }
      `,
      variables:{
        playlist_id : this.id,
        user_id : this.curUserAll.user_id
      }
    }).subscribe(result => {
      alert("Deleted")
      window.location.href = "home"
    })
  }


  copy(){
    var copyText = document.getElementById("urls");
  
    /* Select the text field */
    copyText.select(); 
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
    alert("Copied Url")
  
  }
}
