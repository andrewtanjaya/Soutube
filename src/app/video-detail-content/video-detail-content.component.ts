import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Video } from '../Type/video';
import { addSyntheticLeadingComment } from 'typescript';
import { SocialUser } from 'angularx-social-login';


@Component({
  selector: 'app-video-detail-content',
  templateUrl: './video-detail-content.component.html',
  styleUrls: ['./video-detail-content.component.sass']
})
export class VideoDetailContentComponent implements OnInit {
  email : String;
  showRight : boolean
  link : String
  linkCurr : String;
  plq  :any;
  q : number
  subbedChannel : any;
  curUserAll : any;
  doneSubbed : Boolean
  related : any;
  id : any;
  video : Video;
  message : Boolean;
  comments : any;
  user : any;
  comment_count : number;
  currentUser : any;
  likedVideo : any;
  dislikedVideo : any;
  view : any
  checkView : any
  viewed : Boolean
  key : Boolean
  observer : any
  lastIndex  = 4
  showPlay = false
  playlists : any
  showShare : boolean;
  looped : boolean;
  constructor(private data : DataServiceService, private _Activatedroute:ActivatedRoute, private apollo : Apollo,private router : Router) { }
  
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

  togglePlay(){
    this.showPlay = !this.showPlay

  }

  short(event){
    let Myvideo = (document.getElementsByTagName('mat-video')[0] as HTMLVideoElement).querySelector('video');
    var x = event.keyCode
    // alert(this.key)
    if(x === 75 ){
      if(Myvideo.paused){
        Myvideo.play();
      }
      else{
        Myvideo.pause();
      }
    }
    if(x === 74){
      Myvideo.currentTime -=10 
    }
    if(x === 76){
      Myvideo.currentTime += 10
    }
    if(x === 38){
      if(Myvideo.volume < 1){
        Myvideo.volume += 0.1
      var a = (((Myvideo.closest("mat-video").querySelector("mat-volume-control")
                  .querySelector("mat-slider").querySelector(".mat-slider-thumb-container"))) as HTMLElement);
      var min = (1-Myvideo.volume)*100;
      var c = "translate(-" + min +"%)";
      a.style.transform = c;

      console.log(a);
      a.querySelector(".mat-slider-thumb-label-text").innerHTML = Myvideo.volume.toString();
      }
    }
    if(x === 40){
      if(Myvideo.volume > 0){
        Myvideo.volume -= 0.1
        var a = (((Myvideo.closest("mat-video").querySelector("mat-volume-control")
                  .querySelector("mat-slider").querySelector(".mat-slider-thumb-container"))) as HTMLElement);
      var min = (1-Myvideo.volume)*100;
      var c = "translate(-" + min +"%)";
      a.style.transform = c;

      console.log(a);
      a.querySelector(".mat-slider-thumb-label-text").innerHTML = Myvideo.volume.toString();
      }
      
    }
  }

  addPlaylist(){
    let des = "No Description"
    let playname = document.getElementById("namep").value
    let visi = document.getElementById("vs").value
    let today = new Date()
    this.apollo.mutate({
      mutation: gql `
      mutation createPlaylist($playlist_name : String! , $user_id : Int!, $visibility : String!, $description : String! , $day : Int! , $month : Int!, $year : Int! , $hour : Int!, $minute : Int!, $second : Int! , $sortby : Int!){
        createPlaylist(
          input : {
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
          playlist_id,
          playlist_name,
          user_id,
          visibility,
          description,
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
        playlist_name : playname,
        user_id : this.currentUser.user_id,
        visibility : visi,
        description : des,
        day : today.getDate(),
        month : today.getMonth() + 1,
        year : today.getFullYear(),
        hour : today.getHours(),
        minute : today.getMinutes(),
        second : today.getSeconds(),
        sortby : 1,

      },refetchQueries:[{
        query: gql `
      query getPlayListUser($user_id : Int!){
        getPlayListUser(user_id : $user_id){
          playlist_name,
          user_id,
          visibility,
          description,
          day,
          month,
          year,
          hour,
          minute,
          second,
          sortby,
        }
      }
      `,
      variables:{
        user_id : this.currentUser.user_id
      }

      }]
    }).subscribe(result => {
      alert("added")
    })

  }
  currtime : number;

  rightC(ev){
      document.getElementById("ilang").style.top = ev.clientY + "px";
      // alert(ev.clientY);
      document.getElementById("ilang").style.left = ev.clientX + "px";
      document.getElementById("ilang").style.display = "block";
      ev.preventDefault();
      // alert('success!');
      this.link = window.location.href
      this.linkCurr = this.link + "?" + "curr=" +document.getElementById("vi").querySelector("video").currentTime

      // alert(this.linkCurr)
      document.getElementById("cu").value = this.linkCurr;
      // alert(document.getElementById("cu").value)
      document.getElementById("lis").value = this.link;
      return false;
  
  }
  ngOnInit(): void {
    this.looped = false
    this.showRight = false
    document.getElementById("vi").addEventListener('contextmenu', this.rightC, false);
    if(JSON.parse(localStorage.getItem("users"))) this.email = JSON.parse(localStorage.getItem("users"))[0].email
    this.link = window.location.href;
    this.showShare = false
    this.key = true
    this.viewed = false
    this._Activatedroute.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        this.currtime = params.curr;
        // alert(this.currtime); // popular
      }
    );
    if(this.currtime){
      document.getElementById("vi").querySelector("video").currentTime = this.currtime
    }

    let mat = document.getElementById("vi");
    mat.querySelector("video").addEventListener("ended",
      ()=>{
        if(localStorage.getItem("queue") && JSON.parse(localStorage.getItem("queue"))[(parseInt(localStorage.getItem("currIndex"))+1)].video_id){
          window.location.href ="/videoPlayer/"+ JSON.parse(localStorage.getItem("queue"))[(parseInt(localStorage.getItem("currIndex"))+1)].video_id
        }
        if(this.q != -1){
          window.location.href = "/videoPlayer/"+this.q
        }
      }
    );
    this.data.changeMessage(false);
    this.observer = new IntersectionObserver((entry)=>{
      if(entry[0].isIntersecting){
        let card = document.querySelector(".commentSection");
        for(let i:number=0;i<4;i++){
          if(this.lastIndex < this.comments.length){
            let div = document.createElement("div");
            let video = document.createElement("app-comments")
            video.setAttribute("comment","this.comments[this.lastIndex]");
            div.appendChild(video);
            card.appendChild(div);
            this.lastIndex++
          }
        }
      }
    });
    this.observer.observe(document.querySelector(".footer"));

    document.addEventListener("click", (evt) => {
      const flyoutElement = document.getElementById("pl");
      let targetElement = evt.target; // clicked element
  
      do {
          if (targetElement == flyoutElement) {
              this.key = true
              document.addEventListener("keyup", this.short , false);
              return;
          }
          targetElement = targetElement.parentNode;
      } while (targetElement);
      this.key = false
      document.removeEventListener("keyup",this.short)
  });
  document.addEventListener("click", (evt) => {
    const flyoutElement = document.getElementById("sho");
    let targetElement = evt.target; // clicked element

    do {
        if (targetElement == flyoutElement) {
            // Do nothing, just return.
            this.showShare = true
            this.linkCurr = this.link + "?" + "curr=" + document.getElementById("vi").querySelector("video").currentTime
            return;
        }
        // Go up the DOM.
        targetElement = targetElement.parentNode;
    } while (targetElement);

    this.showShare = false;
});
  


    this.haveLiked  = false
    this.haveDisliked = false
    if(localStorage.getItem("users")){
      this.checkUserInDb();
    }
    
    this.data.currentMessage.subscribe(message =>this.message = message)
    this.data.nextQ.subscribe(q => this.q = q)
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('vidId'); 
      this.initializeView();
      this.initializeVideo();
      
      
    });

  }
  
  initializeVideo(){
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
        video_id: this.id
      }
    }).valueChanges.subscribe(result => {
      if(localStorage.getItem("users")){
        this.checkLiked(this.id)
        this.checkDisliked(this.id)
      }
      
      this.video = result.data.getVideo;

      if(JSON.parse(localStorage.getItem("queue"))){
        for(let i=0;i<JSON.parse(localStorage.getItem("queue")).length;i++){
          if(this.video.video_id == JSON.parse(localStorage.getItem("queue"))[i].video_id){
            localStorage.setItem("currIndex",i.toString());
          }
        }
      }
      

      if(today.getFullYear() > this.video.year){
        this.dateDetail = "<p>" + (today.getFullYear() - this.video.year) +" year ago</p>"
      }
      else if(today.getMonth()+1 > this.video.month){
        this.dateDetail = "<p>" + (today.getMonth()+1 - this.video.month) +" month ago</p>"
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
      console.log(this.video)
      this.apollo.watchQuery<any>({
        query: gql `
          query getUser($user_id : Int!){
            getUser(user_id : $user_id) {
              user_id,
              user_name,
              membership,
              img_url,
              email,
              subscriber_count
            }
          }
        `,
        variables:{
          user_id: this.video.user_id
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
          });
        }
        console.log(this.user)
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
            video_id : this.id
          }
        }).valueChanges.subscribe(result => {
          this.comments = result.data.getComment
          console.log(this.comments)
          this.comment_count = this.comments.length
        })
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
          video_id : this.id
        }
      }).valueChanges.subscribe(result => {
        this.likedVideo = result.data.getLikedVideo
      })
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
          video_id : this.id
        }
      }).valueChanges.subscribe(result => {
        this.dislikedVideo = result.data.getDislikedVideo
        let likenum  = this.likedVideo.length
        let dislikenum = this.dislikedVideo.length
        let total = likenum + dislikenum
        let end = (100/total)*likenum
        document.getElementById("likeLine").setAttribute("style","width : "+ end+"px")
      })
        
      })
      
  }

  sortNew(){
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
        video_id : this.id
      }
    }).valueChanges.subscribe(result => {
      this.comments = result.data.getComment
    this.comments.sort((a,b)=> 
      ((((a.day*86400)+(a.month*86400*30)+(a.year*86400*30*12)+(a.hour*3600)+(a.minute*60)+(a.second)) < ((b.day*86400)+(b.month*86400*30)+(b.year*86400*30*12)+(b.hour*3600)+(b.minute*60)+(b.second))) ? 1 : -1)
    )
  })
  }

  sortTop(){
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
        video_id : this.id
      }
    }).valueChanges.subscribe(result => {
      this.comments = result.data.getComment
      this.comments.sort((a,b) =>
      ((this.getLikeComment(a.comment_id) &&  this.getLikeComment(a.comment_id) && (this.getLikeComment(a.comment_id).length) > (this.getLikeComment(b.comment_id).length))) ? 1 : -1
    )
    })
   
  }

  getLikeComment(comment_id : number) : any{
    console.log(comment_id)
    let likedComment : any;
    this.apollo.watchQuery<any>({
      query: gql `
      query getLikedComment($comment_id : Int!){
        getLikedComment(comment_id : $comment_id){
          like_id
          user_id,
          comment_id,
        }
      }
      `,
      variables:{
        comment_id : comment_id
      }
    }).valueChanges.subscribe(result => {
      likedComment = result.data.getLikedComment
      return likedComment
    })
  }
  

  initializeView(){
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
        video_id : this.id
      }
    }).valueChanges.subscribe(result => {
      this.view = result.data.getView
      if(localStorage.getItem("users")){
        if(this.viewed == false){
          this.apollo.mutate({
            mutation: gql `
            mutation createView($user_id : Int! , $video_id : Int!, $view_count : Int!){
              createView(
                input : {
                  user_id : $user_id,
                  video_id : $video_id,
                  view_count : $view_count,
                }
              ){
                view_id,
              video_id,
              view_count,
              user_id,
              }
            }
            `,
            variables:{
              user_id : this.currentUser.user_id,
              video_id : this.id,
              view_count : 1
            },refetchQueries:[{
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
              video_id : this.id
            }

            }]
          }).subscribe(result => {
            this.viewed = true
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
                id : this.id,
                video_url : this.video.video_url,
                video_title : this.video.video_title,
                video_desc : this.video.video_desc,
                video_cat : this.video.video_cat,
                video_thumb : this.video.video_thumb,
                playlist_id : this.video.playlist_id,
                like_count : this.video.like_count,
                dislike_count : this.video.dislike_count,
                age_restriction : this.video.age_restriction,
                visibility : this.video.visibility,
                location_video : this.video.location_video,
                status : this.video.status,
                premium : this.video.premium,
                view_count : this.view.length+1,
                user_id : this.video.user_id,
                video_duration : this.video.video_duration,
                day : this.video.day,
                month : this.video.month,
                year : this.video.year,
                hour : this.video.hour,
                minute : this.video.minute,
                second : this.video.second,
                
              }
            }).subscribe((result) => {
    
            },(error) => {
        
              console.log('there was an error sending the query', error);
            });
            // window.location.reload()
          })
        }
        
      // this.apollo.watchQuery<any>({
      //   query: gql `
      //   query checkView($video_id : Int! , $user_id : Int!){
      //     checkView(video_id : $video_id , user_id : $user_id){
      //       view_id,
      //       video_id,
      //       view_count,
      //       user_id,
      //     }
      //   }
      //   `,
      //   variables:{
      //     video_id : this.id,
      //     user_id : this.currentUser.user_id
      //   }
      // }).valueChanges.subscribe(result => {
      //   this.checkView = result.data.checkView
        // if(this.checkView.user_id == 0){
          
        // }
      // })
    }
    })
  }

  addComment(){
    let today = new Date()
    let user_id = this.currentUser.user_id
    let comment = document.getElementById("dcomment").value
    console.log("WKKWKW")
    console.log(user_id)
    console.log(comment)
    console.log(this.id)
    this.apollo.mutate({
      mutation: gql `
      mutation createComment ($user_id : Int! , $video_id : Int! , $comment : String! , $like_count : Int! , $dislike_count : Int!, $day : Int!, $month : Int!, $year : Int!, $hour : Int!, $minute : Int!, $second : Int!){
        createComment(input :{
          user_id : $user_id , video_id : $video_id , comment : $comment , like_count : $like_count , dislike_count : $dislike_count, day : $day , month : $month , year : $year , hour : $hour , minute : $minute , second : $second
        }
        ){
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
        user_id : user_id,
        video_id : this.id,
        comment : comment,
        like_count : 0,
        dislike_count : 0,
        day : today.getDate(),
        month : today.getMonth()+1,
        year : today.getFullYear(),
        hour : today.getHours(),
        minute : today.getMinutes(),
        second : today.getSeconds()
      },
      refetchQueries:[{
        query : gql `
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
        `,variables:{
          repoFullName : 'appollographql/apollo-client',
          video_id : this.id
        },
      }]
    }).subscribe(result => {
      console.log(this.comments)
      this.comment_count = this.comments.length
      alert("Comment posted")
      // window.location.reload()  
      document.getElementById("dcomment").value = ""
    })

  }

  checkUserInDb(){
    console.log("ini email")
    
    let email = JSON.parse(localStorage.getItem("users"))[0].email
    console.log(email)
    // alert(email);
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
    email: email
    }
    }).valueChanges.subscribe(result => {
    
    this.currentUser = result.data.getUserId

    this.apollo.watchQuery<any>({
      query: gql `
      query getPlayListUser ($user_id : Int!){
        getPlayListUser(user_id : $user_id) {
          user_id
          playlist_id
          playlist_name
          visibility
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
        user_id: this.currentUser.user_id
      }
    }).valueChanges.subscribe(result => {
      this.playlists = result.data.getPlayListUser;
      
      // alert(this.playlists)
      // alert("BOO")
      console.log(this.playlists)
    });
    console.log(this.currentUser)
    console.log("HIHIHI")
    })
}

haveLiked : Boolean

checkLiked(video_id : number){
  let liked : any
  this.apollo.watchQuery<any>({
    query: gql `
    query checkLikedVideo($video_id : Int!, $user_id : Int!){
      checkLikedVideo(video_id : $video_id, user_id : $user_id){
        user_id,
        like_id,
        video_id
      }
    }
    `,
    variables:{
    video_id : video_id,
    user_id : this.currentUser.user_id
    }
    }).valueChanges.subscribe(result => {
      liked = result.data.checkLikedVideo
      if (liked.user_id != 0){
        this.haveLiked = true
        document.getElementById("likedId").style.color = "blue"
      }
      else 
        this.haveLiked = false

    })
}
haveDisliked : Boolean
checkDisliked(video_id : number){
  let disliked : any
  this.apollo.watchQuery<any>({
    query: gql `
    query checkDislikedVideo($video_id : Int!, $user_id : Int!){
      checkDislikedVideo(video_id : $video_id, user_id : $user_id){
        user_id,
        dislike_id,
        video_id
      }
    }
    `,
    variables:{
    video_id : video_id,
    user_id : this.currentUser.user_id
    }
    }).valueChanges.subscribe(result => {
      disliked = result.data.checkDislikedVideo
      if (disliked.user_id != 0 && disliked){
        this.haveDisliked = true
        document.getElementById("dislikedId").style.color = "blue"
      }
      else 
        this.haveDisliked = false

    })
}

onEnd(){
  this.router.navigate(["/home"])
}

like(video_id : number){
  if(!this.haveLiked){
    this.apollo.mutate({
      mutation: gql `
      mutation createLikedvid($user_id : Int! , $video_id : Int!){
        createLikedvid(
          input: {
            user_id : $user_id,
            video_id : $video_id
          }
        ){
          like_id,
          user_id,
          video_id
        }
      }
      `,
      variables:{
        user_id : this.currentUser.user_id,
        video_id : video_id
      },refetchQueries:[{
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
        video_id : this.id
      }

      }]
    }).subscribe(result => {
      alert("Thanks For Liking this video")
      this.haveLiked = true
      // window.location.reload()
      document.getElementById("likedId").style.color = "blue"
    })
  
    if(this.haveDisliked){
      this.undislike(video_id)
    }
  }else{
    this.unlike(video_id)
  }
}

dislike(video_id : number){
  if(!this.haveDisliked){
    this.apollo.mutate({
      mutation: gql `
      mutation createDislikedvid($video_id : Int! , $user_id : Int!){
        createDislikedvid(
          input: {
            user_id : $user_id,
            video_id : $video_id
          }
        ){
          dislike_id,
          user_id,
          video_id
        }
      }
      `,
      variables:{
        user_id : this.currentUser.user_id,
        video_id : video_id
      },refetchQueries:[{
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
        video_id : this.id
      }
  
      }]
    }).subscribe(result => {
      alert("So Sad 😥")
      this.haveDisliked = true
      document.getElementById("dislikedId").style.color = "blue"
    })
    if(this.haveLiked){
      this.unlike(video_id)
    }
  }
  else{
    this.undislike(video_id)
  }

}

unlike(video_id : number){
  this.apollo.mutate({
    mutation: gql `
    mutation deleteLikedvid($video_id : Int!, $user_id : Int!){
      deleteLikedvid(video_id : $video_id ,user_id : $user_id)
    }
    `,
    variables:{
      user_id : this.currentUser.user_id,
      video_id : video_id,
    },refetchQueries:[{
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
      video_id : this.id
    }

    }]
  }).subscribe(result => {
    alert("Unliked") 
    this.haveLiked = false
    document.getElementById("likedId").style.color = "black"
  })
}
undislike(video_id : number){
  this.apollo.mutate({
    mutation: gql `
    mutation deleteDislikedvid($video_id : Int!, $user_id : Int!){
      deleteDislikedvid(video_id : $video_id , user_id : $user_id)
    }
    `,
    variables:{
      user_id : this.currentUser.user_id,
      video_id : video_id,
    },refetchQueries:[{
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
      video_id : this.id
    }

    }]
  }).subscribe(result => {
    alert("UnDisliked 🥺") 
    this.haveDisliked = false
    document.getElementById("dislikedId").style.color = "black"
  })
}


keyChecker(e : any){
  console.log(this.key)
  if(e.keyCode == 27 ){
    alert("pause")
  }
}


addToPlaylist(playlist){
  if(document.getElementById("ch"+playlist.playlist_id).checked){
    this.apollo.mutate({
      mutation: gql `
      mutation createList($playlist_id : Int! , $video_id : Int!){
        createList(
          input : {
            playlist_id : $playlist_id,
            video_id : $video_id,
          }
        ){
          playlist_id,
          video_id,
          list_id
        }
      }
      `,
      variables:{
        playlist_id : playlist.playlist_id,
        video_id : this.id
  
      }
      
    }).subscribe(result => {
      let today = new Date();
      let des = playlist.description;
      console.log(playlist.playlist_name)
      console.log(playlist.playlist_id)
      if(!playlist.description){
        des = "no description"
      }
      console.log(des)
      console.log(playlist.visibility)
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
          id : playlist.playlist_id,
          playlist_name : playlist.playlist_name,
          user_id : playlist.user_id,
          visibility : playlist.visibility,
          description : des,
          day : today.getDate(),
          month : today.getMonth()+1,
          year : today.getFullYear(),
          hour : today.getHours(),
          minute : today.getMinutes(),
          second : today.getSeconds(),
          
        }
      }).subscribe((result) => {
        alert("added To Playlist")
        window.location.reload()
      },(error) => {
  
        console.log('there was an error sending the query', error);
      });
    })
  }
}

unSubs(){
  this.apollo.mutate({
    mutation: gql `
    mutation deleteSubs($user_id : Int! , $subscriber_id : Int!){
      deleteSubs(user_id : $user_id , subscriber_id : $subscriber_id)
    }
    `,
    variables:{
      user_id : this.video.user_id,
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
          user_id: this.video.user_id
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
          user_id : this.video.user_id,
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
              user_id: this.video.user_id
            }
        }]
      }).subscribe(result => {
        alert("Subscribed")
        window.location.reload()
      })
  }
  
}
checkSubbed(){
  // alert(this.user.user_id)
  console.log("BBABABBAB")
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
    // alert(this.subbedChannel.subs_id)
    if(this.subbedChannel.subs_id != 0){
      this.doneSubbed = true
      // alert("asda")
    }
    else{
      // alert("qweqewq")
      this.doneSubbed = false
    }
  });
}

copyRight(){
  var copyText = document.getElementById("lis");

  /* Select the text field */
  copyText.select(); 
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");
  alert("Copied Url")
}

copyCurrRight(){
  var copyText = document.getElementById("cu");
  // alert("masuk")
  /* Select the text field */
  copyText.select(); 
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");
  alert("Copied Url")
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

copyCurr(){
  var copyText = document.getElementById("urlss");

  /* Select the text field */
  copyText.select(); 
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");
  alert("Copied Url")

}

ref(){
  document.getElementById("ilang").style.display = "none"
}

loopp(){
  
  this.looped = !this.looped
  alert(this.looped)
}

}


