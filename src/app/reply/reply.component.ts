import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.sass']
})
export class ReplyComponent implements OnInit {
  @Input() reply : {}
  user : any;
  currUser : any;
  likedreply : any
  likedreplys : any
  dislikedreply : any
  dislikedreplys : any
  likedrep : Boolean
  dislikedrep : Boolean
  constructor(private apollo : Apollo) { }
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
    let today = new Date()
    if(today.getFullYear() > this.reply.year){
      this.dateDetail = "<p >" + (today.getFullYear() - this.reply.year) +" year ago</p>"
    }
    else if(today.getMonth()+1 > this.reply.month){
      this.dateDetail = "<p>" + (today.getMonth()+1 - this.reply.month) +" month ago</p>"
    }
    else if(today.getDate() > this.reply.day){
      this.dateDetail = "<p>" + (today.getDate() - this.reply.day) +" day ago</p>"
    }
    else if(today.getHours() > this.reply.hour){
      this.dateDetail = "<p>" + (today.getHours() - this.reply.hour) +" hour ago</p>"
    }
    else if(today.getMinutes() > this.reply.minute){
      this.dateDetail = "<p>" + (today.getMinutes() - this.reply.minute) +" minute ago</p>"
    }
    else if(today.getSeconds() > this.reply.second && (today.getSeconds() - this.reply.second) > 10){
      this.dateDetail = "<p>" + (today.getSeconds() - this.reply.second) +" seconds ago</p>"
    }
    else{
      this.dateDetail = "<p> Just now</p>"
    }


    this.likedrep = false
    this.currUser = JSON.parse(localStorage.getItem("users"))[0];
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
        user_id: this.reply.user_id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
    })
    this.apollo.watchQuery<any>({
      query: gql `
        query getUserId($email : String!){
          getUserId(email : $email) {
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
        email: this.currUser.email
      }
    }).valueChanges.subscribe(result => {
      this.currUser = result.data.getUserId
      this.apollo.watchQuery<any>({
        query: gql `
        query getLikedreply($reply_id : Int!){
          getLikedReply(reply_id : $reply_id){
            like_id,
            user_id,
            reply_id,
          }
        }
        `,
        variables:{
         reply_id : this.reply.reply_id,
        }
      }).valueChanges.subscribe(result => {
        this.likedreply = result.data.getLikedReply
      })

      this.apollo.watchQuery<any>({
        query: gql `
        query getDislikedreply($reply_id : Int!){
          getDislikedReply(reply_id : $reply_id){
            dislike_id,
            user_id,
            reply_id,
          }
        }
        `,
        variables:{
         reply_id : this.reply.reply_id,
        }
      }).valueChanges.subscribe(result => {
        this.dislikedreply = result.data.getDislikedReply
      })

      this.apollo.watchQuery<any>({
        query: gql `
        query checkLikedreply($reply_id : Int! , $user_id : Int!){
          checkLikedReply(reply_id : $reply_id, user_id : $user_id){
            user_id,
            like_id,
            reply_id
          }
        }
        `,
        variables:{
         reply_id : this.reply.reply_id,
         user_id : this.currUser.user_id
        }
      }).valueChanges.subscribe(result => {
        this.likedreplys = result.data.checkLikedReply
        // alert(this.likedreplys.user_id)
        if(this.likedreplys.user_id != 0)
          this.likedrep = true
        
      })
      this.apollo.watchQuery<any>({
        query: gql `
        query checkDislikedReply($reply_id : Int! , $user_id : Int!){
          checkDislikedReply(reply_id : $reply_id, user_id : $user_id){
            user_id,
            dislike_id,
            reply_id
          }
        }
        `,
        variables:{
         reply_id : this.reply.reply_id,
         user_id : this.currUser.user_id
        }
      }).valueChanges.subscribe(result => {
        this.dislikedreplys = result.data.checkDislikedReply
        // alert(this.likedreplys.user_id)
        if(this.dislikedreplys.user_id != 0)
          this.dislikedrep = true
      })
    })
  }

  makeEdit(reply_id : number){
    document.getElementById("muncul"+this.reply.reply_id).style.display = "block"
    document.getElementById("hilang"+this.reply.reply_id).style.display = "none"
    document.getElementById("ins"+this.reply.reply_id).value = this.reply.reply
  }

  del(reply_id : number){
    this.apollo.mutate({
      mutation: gql `
      mutation updateReply($id : Int!, $comment_id : Int!, $user_id : Int! , $reply : String!){
        updateReply( id : $id ,input:{comment_id : $comment_id , user_id : $user_id, reply : $reply}
        ){
          comment_id,
          user_id,
          reply_id,
          reply
        }
      }
      `,
      variables:{
        id : reply_id,
        comment_id : 123, //asal aj gpp soalny yg diupdate cuma isi doang
        user_id : 123,
        reply : document.getElementById("ins"+this.reply.reply_id).value
      },
      refetchQueries:[{
        query: gql `
      query getReplyComment ($comment_id : Int!){
        getReplyComment(comment_id : $comment_id) {
          reply_id,
          comment_id,
          reply,
          user_id,
        }
      }
      `,
      variables:{
        comment_id : this.reply.comment_id
      }
      }]
    }).subscribe(result => {

      alert("Reply Updated");
      document.getElementById("muncul"+this.reply.reply_id).style.display = "none"
    document.getElementById("hilang"+this.reply.reply_id).style.display = "block"
      // window.location.reload();
    })
  }

  saveChanges(reply_id : number){
    this.apollo.mutate({
      mutation: gql `
      mutation updateReply($id : Int!, $comment_id : Int!, $user_id : Int! , $reply : String!){
        updateReply( id : $id ,input:{comment_id : $comment_id , user_id : $user_id, reply : $reply}
        ){
          comment_id,
          user_id,
          reply_id,
          reply
        }
      }
      `,
      variables:{
        id : reply_id,
        comment_id : 123, //asal aj gpp soalny yg diupdate cuma isi doang
        user_id : 123,
        reply : document.getElementById("ins"+this.reply.reply_id).value
      },
      refetchQueries:[{
        query: gql `
      query getReplyComment ($comment_id : Int!){
        getReplyComment(comment_id : $comment_id) {
          reply_id,
          comment_id,
          reply,
          user_id,
        }
      }
      `,
      variables:{
        comment_id : this.reply.comment_id
      }
      }]
    }).subscribe(result => {

      alert("Reply Updated");
      document.getElementById("muncul"+this.reply.reply_id).style.display = "none"
    document.getElementById("hilang"+this.reply.reply_id).style.display = "block"
      window.location.reload();
    })
  }
  cancel(reply_id : number){
    document.getElementById("muncul"+this.reply.reply_id).style.display = "none"
    document.getElementById("hilang"+this.reply.reply_id).style.display = "block"
  }

  show(reply_id : number){
    document.getElementById("con"+reply_id).style.display = "block"
    document.getElementById("replyTxt"+reply_id).value = "@" + this.user.user_name +" "
  }

  canceled(reply_id : number){
    document.getElementById("con"+reply_id).style.display = "none"
  }

  rep(reply : any){
    this.apollo.mutate({
      mutation: gql `
      mutation createReply($comment_id : Int!, $user_id : Int!, $reply : String!){
        createReply(input :{
          comment_id : $comment_id , user_id : $user_id , reply : $reply
        }
        ){
          reply_id,
          comment_id,
          user_id,
          reply,
        }
      }
      `,
      variables:{
        comment_id : reply.comment_id,
        user_id : this.currUser.user_id,
        reply : document.getElementById("replyTxt"+reply.reply_id).value
      },
      refetchQueries:[{
        query: gql `
      query getReplyComment ($comment_id : Int!){
        getReplyComment(comment_id : $comment_id) {
          reply_id,
          comment_id,
          reply,
          user_id,
        }
      }
      `,
      variables:{
        comment_id : reply.comment_id
      }
      }]
    }).subscribe(result => {
      alert("Reply Posted");
      window.location.reload();
    })
  }

  addLike(reply_id : number){
    this.apollo.mutate({
      mutation: gql `
      mutation createLikedreply($user_id : Int! , $reply_id : Int!){
        createLikedreply(
          input: {
            user_id :$user_id,
            reply_id :$reply_id
          }
        ){
          like_id,
          user_id,
          reply_id
        }
      }
      `,
      variables:{
        reply_id : reply_id,
        user_id : this.currUser.user_id,
      }
    }).subscribe(result => {
      alert("Liked Reply");
      if(this.dislikedrep)
        this.unDislike(reply_id)
      window.location.reload();

    })
  }

  unLike(reply_id : number){
    this.apollo.mutate({
      mutation: gql `
      mutation deleteLikedreply($reply_id : Int!, $user_id : Int!){
        deleteLikedreply(reply_id : $reply_id , user_id : $user_id)
      }
      `,
      variables:{
        reply_id : reply_id,
        user_id : this.currUser.user_id,
      }
    }).subscribe(result => {
      alert("Unliked");
      window.location.reload();

    })
  }

  unDislike(reply_id : number){
    this.apollo.mutate({
      mutation: gql `
      mutation deleteDislikedreply($reply_id : Int! , $user_id : Int!){
        deleteDislikedreply(reply_id : $reply_id , user_id : $user_id)
      }
      `,
      variables:{
        reply_id : reply_id,
        user_id : this.currUser.user_id,
      }
    }).subscribe(result => {
      alert("UndisLiked Reply");
      
      window.location.reload();
    })
  }
  addDislike(reply_id : number){
    this.apollo.mutate({
      mutation: gql `
      mutation createDislikedreply($user_id : Int! , $reply_id : Int!){
        createDislikedreply(
          input: {
            user_id :$user_id,
            reply_id :$reply_id
          }
        ){
          dislike_id,
          user_id,
          reply_id
        }
      }
      `,
      variables:{
        reply_id : reply_id,
        user_id : this.currUser.user_id,
      }
    }).subscribe(result => {
      alert("DisLiked Reply");
      if(this.likedrep)
        this.unLike(reply_id)
      window.location.reload();

    })
  }

}
