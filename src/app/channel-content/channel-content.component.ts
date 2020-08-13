import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ActivatedRoute } from '@angular/router';
import { AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'apollo-link';
import { AngularFirestore } from 'angularfire2/firestore';
import { finalize, tap } from 'rxjs/operators';
import { SocialUser } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel-content',
  templateUrl: './channel-content.component.html',
  styleUrls: ['./channel-content.component.sass']
})
export class ChannelContentComponent implements OnInit {
  message : Boolean
  playlists : any;
  sortedVideos : any
  videos : any
  user : any
  curUser : any
  curUserAll : any
  subbed : any
  subbedChannel : any
  doneSubbed : boolean
  randomize : any;
  showCust : boolean
  constructor(private storage : AngularFireStorage, private db : AngularFirestore, private data : DataServiceService ,  private apollo : Apollo, private _Activatedroute:ActivatedRoute) { }
  id : any;
  ngOnInit(): void {
    this.showCust = false
    document.addEventListener("click", (evt) => {
      const flyoutElement = document.getElementById("custom");
      const flyoutElement2 = document.getElementById("isi");
      const flyoutElement3 = document.getElementById("1");
      const flyoutElement4 = document.getElementById("2");
      const flyoutElement5 = document.getElementById("3");
      const flyoutElement6 = document.getElementById("4");
      const flyoutElement7 = document.getElementById("5");
      const flyoutElement8 = document.getElementById("6");
      const flyoutElement9 = document.getElementById("bg");
      const flyoutElement10 = document.getElementById("pp");

      let targetElement = evt.target; // clicked element
  
      
          if (targetElement == flyoutElement ) {
              // Do nothing, just return.
              this.showCust = true
              return;
          }

  
      // Do something useful here.
            else if(targetElement == flyoutElement2 || targetElement == flyoutElement3 || targetElement == flyoutElement4 ||targetElement == flyoutElement5 ||targetElement == flyoutElement6 ||targetElement == flyoutElement7 || targetElement == flyoutElement8 || targetElement == flyoutElement9 || targetElement == flyoutElement10 ){
              this.showCust = true
            }
            else{
              this.showCust = false
            }
      
  });
    this.data.currentMessage.subscribe(message =>this.message = message)
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('user_id'); 
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
            subscriber_count,
            day,
            month,
            year,
            hour,
            minute,
            second,
            back,
            shared,
            desc,
            
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
        query getPlayListUser ($user_id : Int!){
          getPlayListUser(user_id : $user_id) {
            user_id
            playlist_id
            playlist_name
            visibility
            description
          }
        }
        `,
        variables:{
          user_id: this.id
        }
      }).valueChanges.subscribe(result => {
        this.playlists = result.data.getPlayListUser;
        this.shuffle(this.playlists)
    })
      console.log(this.user)
      this.apollo.watchQuery<any>({
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
          user_id: this.id
        }
      }).valueChanges.subscribe(result => {
        this.subbed = result.data.getSubscriber
        // console.log(this.id)
        // console.log(this.user.membership)
        // console.log(this.user.img_url)
        // console.log(this.user.email)
        // console.log(this.user.user_name)
        // console.log(this.subbed.length)
        // console.log(this.user.day)
        let back;
        let desc;
        let shared;
        if(!this.user.back) back = "none"
        else back = this.user.back
        if(!this.user.desc) desc = "none"
        else desc = this.user.desc
        if(!this.user.shared) shared = "none"
        else shared = this.user.shared
        console.log("WOIWOWOWOWO")
        console.log(back)
        console.log(shared)
        console.log(desc)
        this.apollo.mutate({
          mutation: gql `

          mutation updateUser (
                  $user_id : Int!,
                  $membership : Boolean!,
                  $img_url : String!,
                  $email : String!,
                  $user_name : String!,
                  $subscriber_count : Int!,
                  $day : Int!,
                  $month : Int!,
                  $year : Int!,
                  $hour : Int!,
                  $minute : Int!,
                  $second : Int!,
                  $back : String!,
                  $shared : String!,
                  $premium : Time!,
                  $desc : String!

          ) {
            updateUser(
              user_id : $user_id , input : { membership : $membership , img_url : $img_url , email : $email , user_name : $user_name, subscriber_count : $subscriber_count , day : $day, month : $month , year : $year , hour : $hour , minute : $minute, second : $second , back : $back , shared : $shared, desc : $desc , premium : $premium}
            ){
              user_id,
              
            }
          } 
          `,
          variables:{
            user_id : this.id,
            membership : this.user.membership,
            img_url : this.user.img_url,
            email : this.user.email,
            user_name : this.user.user_name,
            subscriber_count : this.subbed.length,
            day : this.user.day,
            month : this.user.month,
            year : this.user.year,
            hour : this.user.hour,
            minute : this.user.minute,
            second : this.user.second,
            back : back,
            shared : shared,
            premium : new Date(),
            desc : desc,

          }
        }).subscribe((result) => {
          // alert("updated")
        },(error) => {
          alert("error")
          console.log('there was an error sending the query', error);
        });
      })
  });
  this.apollo
        .watchQuery<any>({
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
              second
            }
          }
          `,
          variables:{
            user_id : this.id
          }
        })
        .valueChanges.subscribe(result => {
          this.videos = result.data.getVideoUser;
          console.log(this.videos)
          this.sortedVideos = this.videos.sort((a,b) =>
            ((((a.day*86400)+(a.month*86400*30)+(a.year*86400*30*12)+(a.hour*3600)+(a.minute*60)+(a.second)) < ((b.day*86400)+(b.month*86400*30)+(b.year*86400*30*12)+(b.hour*3600)+(b.minute*60)+(b.second))) ? 1 : -1)
          )
          this.getRandom();
          console.log(this.sortedVideos)
        }); 

      if(localStorage.getItem("users")){
        this.curUser = JSON.parse(localStorage.getItem("users"))[0].email
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
            email : this.curUser,
        }
      }).valueChanges.subscribe(result => {
        // alert(this.comment.comment_id)
        this.curUserAll = result.data.getUserId
        this.checkSubbed()
      });
  
          
      } 
  }

  getRandom(){
    this.randomize = this.videos.slice(0);
    this.shuffle(this.randomize)
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
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
          user_id : this.id,
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
        user_id : this.id,
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
            user_id: this.id
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
                user_id: this.id
              }
          }]
        }).subscribe(result => {
          alert("Subscribed")
          window.location.reload()
        })
    }
    
  }

  files: File[] = [];
  task: AngularFireUploadTask;
  task2: AngularFireUploadTask;
  localImage : string;
  uploadedThumbURl : string;
  percentage: Observable<number>;
  percentage2: Observable<number>;
  snapshot: Observable<any>;
  snapshot2: Observable<any>;
  downloadURLs: string;
  fileName : string;
  nextButton = false;

onDrop(files: FileList) {
    this.files.length = 0;
    this.files.push(files.item(0));
    this.startUpload(files.item(0));
}

isActive(snapshot) {
  return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
}

startUpload(file : File) {
  console.log("aaaa");
  this.fileName = file.name;
  console.log("start upload")
  // The storage path
  const path = `video/${Date.now()}_${file.name}`;

  // Reference to storage bucket
  const ref = this.storage.ref(path);

  // The main task
  this.task = this.storage.upload(path, file);

  // Progress monitoring
  this.percentage = this.task.percentageChanges();

  this.snapshot   = this.task.snapshotChanges().pipe(
    tap(console.log),
    // The file's download URL
    finalize( async() =>  {
      this.downloadURLs = await ref.getDownloadURL().toPromise();

      this.db.collection('files').add( { downloadURL: this.downloadURLs, path });
    
      // this.uploadedVideo = true;
      alert("Image Uploaded")
    }),
  );
}

updateBg(){
  let back;
        let desc;
        let shared;
        if(!this.user.back) back = "none"
        else back = this.user.back
        if(!this.user.desc) desc = "none"
        else desc = this.user.desc
        if(!this.user.shared) shared = "none"
        else shared = this.user.shared
  console.log(this.user);
  this.apollo.mutate({
    mutation: gql `

    mutation updateUser (
            $user_id : Int!,
            $membership : Boolean!,
            $img_url : String!,
            $email : String!,
            $user_name : String!,
            $subscriber_count : Int!,
            $day : Int!,
            $month : Int!,
            $year : Int!,
            $hour : Int!,
            $minute : Int!,
            $second : Int!,
            $back : String!,
            $shared : String!,
            $premium : Time!,
            $desc : String!
    ) {
      updateUser(
        user_id : $user_id , input : { membership : $membership , img_url : $img_url , email : $email , user_name : $user_name, subscriber_count : $subscriber_count , day : $day, month : $month , year : $year , hour : $hour , minute : $minute, second : $second , back : $back ,  shared : $shared , premium : $premium , desc : $desc}
      ){
        user_id,
        
      }
    } 
    `,
    variables:{
      user_id : this.id,
      membership : this.user.membership,
      img_url : this.user.img_url,
      email : this.user.email,
      user_name : this.user.user_name,
      subscriber_count : this.subbed.length,
      day : this.user.day,
      month : this.user.month,
      year : this.user.year,
      hour : this.user.hour,
      minute : this.user.minute,
      second : this.user.second,
      back : this.downloadURLs,
      shared : shared,
      premium : new Date(),
      desc : desc
    }
  }).subscribe((result) => {
    window.location.reload();
  },(error) => {

    console.log('there was an error sending the query', error);
  });
}
updatePp(){
  let back;
        let desc;
        let shared;
        if(!this.user.back) back = "none"
        else back = this.user.back
        if(!this.user.desc) desc = "none"
        else desc = this.user.desc
        if(!this.user.shared) shared = "none"
        else shared = this.user.shared
  console.log(this.user);
  this.apollo.mutate({
    mutation: gql `

    mutation updateUser (
            $user_id : Int!,
            $membership : Boolean!,
            $img_url : String!,
            $email : String!,
            $user_name : String!,
            $subscriber_count : Int!,
            $day : Int!,
            $month : Int!,
            $year : Int!,
            $hour : Int!,
            $minute : Int!,
            $second : Int!,
            $back : String!,
            $shared : String!,
            $premium : Time!,
            $desc : String!
    ) {
      updateUser(
        user_id : $user_id , input : { membership : $membership , img_url : $img_url , email : $email , user_name : $user_name, subscriber_count : $subscriber_count , day : $day, month : $month , year : $year , hour : $hour , minute : $minute, second : $second , back : $back ,  shared : $shared , premium : $premium , desc : $desc}
      ){
        user_id,
        
      }
    } 
    `,
    variables:{
      user_id : this.id,
      membership : this.user.membership,
      img_url : this.downloadURLs,
      email : this.user.email,
      user_name : this.user.user_name,
      subscriber_count : this.subbed.length,
      day : this.user.day,
      month : this.user.month,
      year : this.user.year,
      hour : this.user.hour,
      minute : this.user.minute,
      second : this.user.second,
      back : back,
      shared : shared,
      premium : new Date(),
      desc : desc
    }
  }).subscribe((result) => {
    window.location.reload();
  },(error) => {

    console.log('there was an error sending the query', error);
  });
}
}
