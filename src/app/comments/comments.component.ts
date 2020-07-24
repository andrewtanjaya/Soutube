import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { SocialUser } from 'angularx-social-login';
import { UniqueDirectivesPerLocation } from 'graphql/validation/rules/UniqueDirectivesPerLocation';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.sass']
})
export class CommentsComponent implements OnInit {
  @Input() comment 
  user : SocialUser
  replies : any;
  curUserEmail : any
  curUser : any
  stateReply : Boolean
  likedComments : any
  likedComment : any
  dislikedComment : any
  dislikedComments : any
  disliked : boolean
  liked : boolean
  id :any;
  constructor(private apollo : Apollo,private _Activatedroute : ActivatedRoute) { }

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

  commentOne : any
  makeEdit(id : number){
     document.getElementById("muncul"+id).style.display = "block"
     document.getElementById("hilang"+id).style.display = "none"
     this.getCom(id)

  }

  toggleReply(){
    this.stateReply = !this.stateReply
    this.apollo.query()
  }
  getCom(comment_id : number){
    this.apollo.watchQuery<any>({
      query: gql `
      query getCommentById ($comment_id : Int!){
        getCommentById(comment_id : $comment_id){
          comment_id,
          user_id,
          video_id,
          comment,
          like_count,
          dislike_count,
        }
      }
      `,
      variables:{
        comment_id : comment_id 
      }
    }).valueChanges.subscribe(result => {
      this.commentOne = result.data.getCommentById;
      console.log(this.commentOne);
      (document.getElementById("text"+comment_id) as HTMLInputElement).value = this.commentOne.comment;
    })
  }

  saveChange(comment_id : number){
    let newComment = (document.getElementById("text"+comment_id) as HTMLInputElement).value
    let today = new Date()
    this.apollo.mutate({
      mutation: gql `
      mutation updateComment($comment_id : Int!, $comment : String!, $day : Int!, $month : Int!, $year : Int!, $hour : Int! , $minute : Int! , $second : Int!){
        updateComment(comment_id: $comment_id , comment : $comment , day : $day, month : $month , year : $year , hour : $hour , minute : $minute , second : $second
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
          second
        }
      }
      `,
      variables:{
        comment_id : comment_id,
        comment : newComment,
        day : today.getDate(),
        month : today.getMonth()+1,
        year : today.getFullYear(),
        hour : today.getHours(),
        minute : today.getMinutes(),
        second : today.getSeconds(),
      },
      refetchQueries:[{
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
            second
          }
        }
      `,
      variables:{
        video_id : this.id
      }
      }]
    }).subscribe(result => {

      alert("Comment Updated");
      document.getElementById("muncul"+comment_id).style.display = "none"
      document.getElementById("hilang"+comment_id).style.display = "block"
      window.location.reload();
    })
  }

  close(comment_id : number){
    document.getElementById("muncul"+comment_id).style.display = "none"
    document.getElementById("hilang"+comment_id).style.display = "block"
  }

  unLike(comment_id : number){
    this.apollo.mutate({
      mutation: gql `
      mutation deleteLikedcomment($comment_id : Int!, $user_id : Int!){
        deleteLikedcomment(comment_id : $comment_id , user_id : $user_id )
      }
      `,
      variables:{
        user_id : this.curUser.user_id,
        comment_id : comment_id,
      },
      refetchQueries:[{
        query: gql `
      query getLikedComment($comment_id : Int!){
        getLikedComment(comment_id :$comment_id){
          like_id
          user_id,
          comment_id,
        }
      }
      `,
      variables:{
        comment_id : this.comment.comment_id
      }
      }]
    }).subscribe(result => {
      alert("unLiked Comment")
      window.location.reload()
    })
  }

  addLike(comment_id : number){
    this.apollo.mutate({
      mutation: gql `
      mutation createLikedcomments ($user_id : Int! , $comment_id : Int!){
        createLikedcomment(
          input : {
            user_id : $user_id,
            comment_id : $comment_id
          }
        ){
          like_id,
          user_id,
          comment_id
        }
      }
      `,
      variables:{
        user_id : this.curUser.user_id,
        comment_id : comment_id,
      },
      refetchQueries:[{
        query: gql `
      query getLikedComment($comment_id : Int!){
        getLikedComment(comment_id :$comment_id){
          like_id
          user_id,
          comment_id,
        }
      }
      `,
      variables:{
        comment_id : this.comment.comment_id
      }
      }]
    }).subscribe(result => {
      alert("Liked Comment")
      window.location.reload()
      this.liked = true
      if(this.disliked){
        this.unDislike(this.comment.comment_id)
      }
    })
  }

  ngOnInit(): void {
    let today = new Date()
    if(today.getFullYear() > this.comment.year){
      this.dateDetail = "<p >" + (today.getFullYear() - this.comment.year) +" year ago</p>"
    }
    else if(today.getMonth()+1 > this.comment.month){
      this.dateDetail = "<p>" + (today.getMonth()+1 - this.comment.month) +" month ago</p>"
    }
    else if(today.getDate() > this.comment.day){
      this.dateDetail = "<p>" + (today.getDate() - this.comment.day) +" day ago</p>"
    }
    else if(today.getHours() > this.comment.hour){
      this.dateDetail = "<p>" + (today.getHours() - this.comment.hour) +" hour ago</p>"
    }
    else if(today.getMinutes() > this.comment.minute){
      this.dateDetail = "<p>" + (today.getMinutes() - this.comment.minute) +" minute ago</p>"
    }
    else if(today.getSeconds() > this.comment.second && (today.getSeconds() - this.comment.second) > 10){
      this.dateDetail = "<p>" + (today.getSeconds() - this.comment.second) +" seconds ago</p>"
    }
    else{
      this.dateDetail = "<p> Just now</p>"
    }

    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('vidId'); 
    });
    this.disliked = false
    this.liked = false
    if(localStorage.getItem("users")){
      this.curUserEmail = JSON.parse(localStorage.getItem("users"))[0].email
      this.nowLoginUser(this.curUserEmail)
    }
    
    // alert(JSON.parse(localStorage.getItem("users"))[0].email)
   
    
    

    this.apollo.watchQuery<any>({
      query: gql `
      query getLikedComment($comment_id : Int!){
        getLikedComment(comment_id :$comment_id){
          like_id
          user_id,
          comment_id,
        }
      }
      `,
      variables:{
        comment_id : this.comment.comment_id
      }
    }).valueChanges.subscribe(result => {
      this.likedComment = result.data.getLikedComment

    })

    this.apollo.watchQuery<any>({
      query: gql `
      query getDislikedComment($comment_id : Int!){
        getDislikedComment(comment_id : $comment_id){
          dislike_id,
          user_id,
          comment_id,
        }
      }
      `,
      variables:{
        comment_id : this.comment.comment_id
      }
    }).valueChanges.subscribe(result => {
      this.dislikedComment = result.data.getDislikedComment
    })

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
        user_id: this.comment.user_id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
    })
    this.apollo.watchQuery<any>({
      query: gql `
      query getReplyComment ($comment_id : Int!){
        getReplyComment(comment_id : $comment_id) {
          reply_id,
          comment_id,
          reply,
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
        comment_id : this.comment.comment_id
      }
    }).valueChanges.subscribe(result => {
      this.replies = result.data.getReplyComment
      console.log(result)
    })
  }

  nowLoginUser(email : string){
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
          email : email,
      }
    }).valueChanges.subscribe(result => {
      // alert(this.comment.comment_id)
      this.curUser = result.data.getUserId
      // alert(this.curUser.user_id)
      this.apollo.watchQuery<any>({
        query: gql `
        query checkLikedcomment($comment_id : Int! , $user_id : Int!){
          checkLikedComment(comment_id : $comment_id, user_id : $user_id){
            user_id,
            like_id,
            comment_id
          }
        }
        `,
        variables:{
          user_id: this.curUser.user_id,
          comment_id : this.comment.comment_id
        }
      }).valueChanges.subscribe(result => {
        this.likedComments = result.data.checkLikedComment
        if(this.likedComments.user_id != 0)
          this.liked = true
        // alert(this.curUser.user_id)
        this.apollo.watchQuery<any>({
          query: gql `
          query checkDislikedcomment($comment_id : Int! , $user_id : Int!){
            checkDislikedComment(comment_id : $comment_id , user_id : $user_id ){
              user_id,
              dislike_id,
              comment_id
            }
          }
          `,
          variables:{
            user_id: this.curUser.user_id,
            comment_id : this.comment.comment_id
          }
        }).valueChanges.subscribe(result => {
          this.dislikedComments = result.data.checkDislikedComment
          if(this.dislikedComments.user_id != 0)
            this.disliked = true
          // alert(this.dislikedComments.user_id)
        })
      })

      
    })
  }

  addDislike(comment_id : number){
    this.apollo.mutate({
      mutation: gql `
      mutation createDislikedcomments($user_id : Int! , $comment_id : Int!){
        createDislikedcomment(
          input : {
            user_id : $user_id,
            comment_id : $comment_id
          }
        ){
          dislike_id,
          user_id,
          comment_id
        }
      }
      `,
      variables:{
        user_id : this.curUser.user_id,
        comment_id : comment_id,
      },
      refetchQueries:[{
        query: gql `
      query getDislikedComment($comment_id : Int!){
        getDislikedComment(comment_id : $comment_id){
          dislike_id,
          user_id,
          comment_id,
        }
      }
      `,
      variables:{
        comment_id : this.comment.comment_id
      }
      }]
    }).subscribe(result => {
      alert("Disliked Comment")
      window.location.reload()
      if(this.liked){
        this.unLike(this.comment.comment_id)
      }
    })
  }
    
  unDislike(comment_id : number){
    this.apollo.mutate({
      mutation: gql `
      mutation deleteDislikedcomment($comment_id : Int! , $user_id : Int!){
        deleteDislikedcomment(comment_id : $comment_id , user_id : $user_id)
      }
      `,
      variables:{
        user_id : this.curUser.user_id,
        comment_id : comment_id,
      },
      refetchQueries:[{
        query: gql `
      query getDislikedComment($comment_id : Int!){
        getDislikedComment(comment_id : $comment_id){
          dislike_id,
          user_id,
          comment_id,
        }
      }
      `,
      variables:{
        comment_id : this.comment.comment_id
      }
      }]
    }).subscribe(result => {
      alert("Undislike Comment")
      window.location.reload()
    })
  }



  deleteComment(comment_id : number){
    // alert("mauk")
    this.apollo.mutate({
      mutation: gql `
      mutation deleteComment($comment_id : Int!){
        deleteComment(id : $comment_id)
      }
      `,
      variables:{
        comment_id : comment_id,
      },
      refetchQueries:[{
        query: gql `
        query getComment($video_id : Int!){
          getComment(video_id : $video_id){
            comment_id,
            user_id,
            video_id,
            comment,
            like_count,
            dislike_count,
          }
        }
      `,
      variables:{
        video_id : this.id
      }
      }]
    }).subscribe(result => {

      alert("Comment Deleted");
      // window.location.reload();
    })
  }


  makeReply(comment_id : number){
    document.getElementById("rep"+comment_id).style.display = "flex"
    document.getElementById("txt"+comment_id).value = "@"+ this.user.user_name + " "
  }

  

  addReply(comment_id : number){
    let today = new Date()
    this.apollo.mutate({
      mutation: gql `
      mutation createReply($comment_id : Int!, $user_id : Int!, $reply : String!, $day : Int!, $month : Int!, $year : Int!, $hour : Int!, $minute : Int!, $second : Int!){
        createReply(input :{
          comment_id : $comment_id , user_id : $user_id , reply : $reply, day : $day , month : $month , year : $year , hour : $hour, minute : $minute , second : $second
        }
        ){
          reply_id,
          comment_id,
          user_id,
          reply,
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
        comment_id : comment_id,
        user_id : this.curUser.user_id,
        reply : document.getElementById("txt"+comment_id).value,
        day : today.getDate(),
        month : today.getMonth()+1,
        year : today.getFullYear(),
        hour : today.getHours(),
        minute : today.getMinutes(),
        second : today.getSeconds()
      },
      refetchQueries:[{
        query: gql `
      query getReplyComment ($comment_id : Int!){
        getReplyComment(comment_id : $comment_id) {
          reply_id,
          comment_id,
          reply,
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
        comment_id : this.comment.comment_id
      }
      }]
    }).subscribe(result => {
      alert("Reply Posted");
      document.getElementById("rep"+comment_id).style.display = "none"
      // window.location.reload();
    })
  }

  cancel(comment_id : number){
    document.getElementById("rep"+comment_id).style.display = "none"
  }


  updateLikeComment(like : number,comment_id : number){
    this.apollo.mutate({
      mutation: gql `
      mutation updateLike (
            $comment_id : Int!,
            $like_count : Int!,
            $dislike_count : Int!,
      ) {
        updateLike(
          comment_id : $comment_id , like_count : $like_count , dislike_count : $dislike_count
        ){
          comment_id,
          comment,
          user_id,
          like_count,
          dislike_count,
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
        comment_id : comment_id,
        like_count : like,
        dislike_count : this.comment.dislike_count
      }
    }).subscribe((result) => {
  
      alert("Like count Updated")
    },(error) => {
  
      console.log('there was an error sending the query', error);
    });
  }
}
