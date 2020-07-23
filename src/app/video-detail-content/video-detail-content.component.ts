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
  q : number
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
  constructor(private data : DataServiceService, private _Activatedroute:ActivatedRoute, private apollo : Apollo,private router : Router) { }

  togglePlay(){
    this.showPlay = !this.showPlay
  }

  addPlaylist(){
    let playname = document.getElementById("namep").value
    let visi = document.getElementById("vs").value
    let today = new Date()
    this.apollo.mutate({
      mutation: gql `
      mutation createPlaylist($playlist_name : String! , $user_id : Int!, $visibility : String!, $day : Int! , $month : Int!, $year : Int! , $hour : Int!, $minute : Int!, $second : Int!){
        createPlaylist(
          input : {
            playlist_name : $playlist_name,
            user_id : $user_id,
            visibility : $visibility,
            day : $day,
            month : $month,
            year : $year,
            hour : $hour,
            minute : $minute,
            second : $second
          }
        ){
          playlist_id,
          playlist_name,
          user_id,
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
      variables:{
        playlist_name : playname,
        user_id : this.currentUser.user_id,
        visbility : visi,
        day : today.getDate(),
        month : today.getMonth() + 1,
        year : today.getFullYear(),
        hour : today.getHours(),
        minute : today.getMinutes(),
        second : today.getSeconds()

      },refetchQueries:[{
        query: gql `
      query getPlaylistUser($user_id : Int!){
        getPlaylistUser(user_id : $user_id){
          playlist_name,
          user_id,
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
      variables:{
        video_id : this.id
      }

      }]
    }).subscribe(result => {
      this.viewed = true
      // window.location.reload()
    })

  }
  ngOnInit(): void {
    this.viewed = false
    let mat = document.getElementById("vi");
    mat.querySelector("video").addEventListener("ended",
      ()=>{
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
              return;
          }
          targetElement = targetElement.parentNode;
      } while (targetElement);
      this.key = false
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
              subscriber_count
            }
          }
        `,
        variables:{
          user_id: this.video.user_id
        }
      }).valueChanges.subscribe(result => {
        this.user = result.data.getUser
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
    this.comments.sort((a,b)=> 
      ((((a.day*86400)+(a.month*86400*30)+(a.year*86400*30*12)+(a.hour*3600)+(a.minute*60)+(a.second)) < ((b.day*86400)+(b.month*86400*30)+(b.year*86400*30*12)+(b.hour*3600)+(b.minute*60)+(b.second))) ? 1 : -1)
    )
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
      ((this.getLikeComment(a.comment_id) && (this.getLikeComment(a.comment_id).length) > (this.getLikeComment(b.comment_id).length))) ? 1 : -1
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
      console.log(likedComment)
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
              // window.location.reload()
            })
          }
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



}


