import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilKeyChanged } from 'rxjs/operators';

@Component({
  selector: 'app-communitycard',
  templateUrl: './communitycard.component.html',
  styleUrls: ['./communitycard.component.sass']
})
export class CommunitycardComponent implements OnInit {
  @Input() com
  curr : any;
  id : any;
  liked : any;
  disliked : any;
  haveLiked : Boolean
  haveDisliked : Boolean
  user : any;
  constructor(private apollo : Apollo , private _Activatedroute : ActivatedRoute) { }

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
    this.haveDisliked = false;
    this.haveLiked = false;
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('user_id'); 
    })
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
      this.curr = result.data.getUserId
      this.checkDisliked(this.com.id)
        this.checkLiked(this.com.id);
    });
    this.apollo.watchQuery<any>({
      query: gql `
        query getUser($user_id : Int!){
          getUser(user_id : $user_id) {
            user_id,
            user_name,
            membership,
            email,
            img_url,
            subscriber_count,
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
        user_id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser

        
        this.apollo.watchQuery<any>({
          query: gql `
          query getLikedCom($com_id : Int!){
            getLikedCom(com_id : $com_id){
              id,
              user_id,
              com_id,
            }
          }
        `,
        variables:{
          com_id : this.com.id
        }
        }).valueChanges.subscribe(result => {
          this.liked = result.data.getLikedCom
          // console.log(this.liked)
        });
        this.apollo.watchQuery<any>({
          query: gql `
          query getDislikedCom($com_id : Int!){
            getDislikedCom(com_id : $com_id){
              id,
              user_id,
              com_id,
            }
          }
        `,
        variables:{
          com_id : this.com.id
        }
        }).valueChanges.subscribe(result => {
          this.disliked = result.data.getDislikedCom
        });
    });
  }


  getDateDiff(asd: string): string {
    let dateDif = '';
    const currentDate = new Date();
    const publish = new Date(asd)
    const min = Math.floor(
      (Date.UTC(currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes(),
        currentDate.getSeconds(),
        currentDate.getMilliseconds()
      ) -
      Date.UTC(publish.getFullYear(),
      publish.getMonth(),
      publish.getDate(),
      publish.getHours(),
      publish.getMinutes(),
      publish.getSeconds(),
      publish.getMilliseconds())
      ) / (1000));
    let temp = 0;
    //ini 1000 ms berarti 1 detik
  
    if (min <= 0){
      temp = -1 * min;
      console.log('temp ', temp);
      dateDif = 'Will be released in ';
    } else {
      temp = min;
    }
  
    const y = Math.floor(temp / 31556952);
    // console.log('Year ', y);
    if (y <= 0) {
      const mon = Math.floor(temp / 2629746);
      // console.log('month ', mon);
  
      if (mon <= 0) {
        const d = Math.floor(temp / 86400);
        // console.log('day ', d);
        if (d <= 0) {
          const hour = Math.floor(temp / 3600);
          // console.log('hour ', hour);
          if (hour <= 0) {
            const minute = Math.floor(temp / 60);
            // console.log('minute ', minute);
            if (minute <= 0) {
              const second = temp;
              // console.log('second ', second);
              if (min < 0) {
                dateDif += second.toString() + ' Second(s)';
              } else {
                dateDif = second.toString() + ' second Ago';
              }
            } else {
              if (min < 0) {
                dateDif += minute.toString() + ' Minute(s)';
              } else {
                dateDif = minute.toString() + ' Minute Ago';
              }
            }
          } else {
            if (min < 0) {
              dateDif += hour.toString() + ' Hour(s)';
            } else {
              dateDif = hour.toString() + ' Hour Ago';
            }
          }
        } else {
          if (min < 0) {
            dateDif += d.toString() + ' Day(s)';
          } else {
            dateDif = d.toString() + ' Day(s) Ago';
          }
        }
      } else {
        if (min < 0) {
          dateDif += mon.toString() + ' Month';
        } else {
          dateDif = mon.toString() + ' Month Ago';
        }
      }
    } else {
      if (min < 0) {
        dateDif += y.toString() + ' Year';
      } else {
        dateDif = y.toString() + ' Year Ago';
      }
    }
  
    return dateDif;
  }

  like(video_id : number){  
    if(!this.haveLiked){
      console.log(this.id)
      this.apollo.mutate({
        mutation: gql `
        mutation createLikedCom($user_id : Int! , $com_id : Int!){
          createLikedCom(
            input: {
              user_id : $user_id,
              com_id : $com_id
            }
          ){
            id,
            user_id,
            com_id
          }
        }
        `,
        variables:{
          user_id : this.curr.user_id,
          com_id : video_id
        },refetchQueries:[{
          query: gql `
          query getLikedCom($com_id : Int!){
            getLikedCom(com_id : $com_id){
              id,
              user_id,
              com_id,
            }
          }
        `,
        variables:{
          com_id : this.com.id
        }
  
        }]
      }).subscribe(result => {
        alert("Thanks For Liking this post")
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
        mutation createDislikedCom($user_id : Int! , $com_id : Int!){
          createDislikedCom(
            input: {
              user_id : $user_id,
              com_id : $com_id
            }
          ){
            id,
            user_id,
            com_id
          }
        }
        `,
        variables:{
          user_id : this.curr.user_id,
          com_id : video_id
        },refetchQueries:[{
          query: gql `
          query getDislikedCom($com_id : Int!){
            getDislikedCom(com_id : $com_id){
              id,
              user_id,
              com_id,
            }
          }
        `,
        variables:{
          com_id : this.com.id
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
      mutation deleteLikedCom($com_id : Int!, $user_id : Int!){
        deleteLikedCom(com_id : $com_id ,user_id : $user_id)
      }
      `,
      variables:{
        user_id : this.curr.user_id,
        com_id : video_id,
      },refetchQueries:[{
        query: gql `
          query getLikedCom($com_id : Int!){
            getLikedCom(com_id : $com_id){
              id,
              user_id,
              com_id,
            }
          }
        `,
        variables:{
          com_id : this.com.id
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
      mutation deleteDislikedCom($com_id : Int!, $user_id : Int!){
        deleteDislikedCom(com_id : $com_id , user_id : $user_id)
      }
      `,
      variables:{
        user_id : this.curr.user_id,
        com_id : video_id,
      },refetchQueries:[{
        query: gql `
        query getDislikedCom($com_id : Int!){
          getDislikedCom(com_id : $com_id){
            id,
            user_id,
            com_id,
          }
        }
      `,
      variables:{
        com_id : this.com.id
      }
  
      }]
    }).subscribe(result => {
      alert("UnDisliked 🥺") 
      this.haveDisliked = false
      document.getElementById("dislikedId").style.color = "black"
    })
  }

  checkLiked(video_id : number){
    let likes : any
    this.apollo.watchQuery<any>({
      query: gql `
      query checkLikedCom($com_id : Int!, $user_id : Int!){
        checkLikedCom(com_id : $com_id, user_id : $user_id){
          user_id,
          id,
          com_id
        }
      }
      `,
      variables:{
        com_id : video_id,
        user_id : this.curr.user_id
      }
      }).valueChanges.subscribe(result => {
        likes = result.data.checkLikedCom
        console.log(likes);
        if (likes && likes.length > 0){
          this.haveLiked = true
          document.getElementById("likedId").style.color = "blue"
        }
        else 
          this.haveLiked = false
  
      })
  }
  checkDisliked(video_id : number){
    let disliked : any
    this.apollo.watchQuery<any>({
      query: gql `
      query checkDislikedCom($com_id : Int!, $user_id : Int!){
        checkDislikedCom(com_id : $com_id, user_id : $user_id){
          user_id,
          com_id,
          id
        }
      }
      `,
      variables:{
      com_id : video_id,
      user_id : this.curr.user_id
      }
      }).valueChanges.subscribe(result => {
        disliked = result.data.checkDislikedCom
        console.log("AAHSAKHSASHA")
        console.log(disliked);
        if (disliked.length > 0 && disliked){
          this.haveDisliked = true
          document.getElementById("dislikedId").style.color = "blue"
        }
        else 
          this.haveDisliked = false
  
      })
  }
}
