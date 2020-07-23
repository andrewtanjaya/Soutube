import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, VirtualTimeScheduler } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { SocialUser } from 'angularx-social-login';
import { Router } from '@angular/router';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.sass']
})
export class FileUploadComponent implements OnInit {
  isHovering: boolean;
  images:File[] = [];
  imageName : string;
  message : Boolean;
  files: File[] = [];
  uploadedVideo = false;
  dur : any;
  objectUrl : any;

  ambilFile(file : File) {
    this.startUpload(file);
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
    console.log("apaaaa")
  }
  
  onDrop(files: FileList) {
    
    // document.getElementById("hideVideo").src = this.objectUrl
    this.files.push(files.item(0));
    this.startUpload(files.item(0));
  }

  onDropImg(images: FileList) {
    this.images.push(images.item(0));
    this.startUploadImg(images.item(0));
  }
  user : SocialUser
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

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private apollo : Apollo, private router : Router, private data : DataServiceService) { }

  ngOnInit() {
    console.log(this.nextButton);
    this.checkUserInDb();
    this.data.currentMessage.subscribe(message =>this.message = message)
    // alert(localStorage.getItem("users"))
  }
  startUpload(file : File) {
    
    this.fileName = file.name;
    if(!this.fileName.includes(".mp4") && !this.fileName.includes(".mkv") && !this.fileName.includes(".mov") && !this.fileName.includes(".3gp")){
      alert("Please Input .mp4,.mkv,.mov,.3gp File")
      return
    }
    this.nextButton = true
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
        
        document.getElementById("hideVideo").src = this.downloadURLs
        let vid = document.getElementById("hideVideo")
        vid.onloadedmetadata = function(){
          // this.dur = this.duration;
          localStorage.setItem('duration', JSON.stringify(Math.floor(this.duration)));
          this.muted = true
        };
        this.uploadedVideo = true;
        alert("Video Uploaded")
      }),
    );
  }


  getThumbnail(files : FileList){
    let filing : File;
    filing = files.item(0)
    var reader = new FileReader();
    reader.onload = e=> this.localImage = reader.result as string
    console.log(this.localImage)
    reader.readAsDataURL(filing);
    this.startUploadImg(filing)
    
  }
  startUploadImg(file : File) {
    
    this.imageName = file.name;
    if(!this.imageName.includes(".png") && !this.imageName.includes(".jpeg")  && !this.imageName.includes(".jpg")){
      alert("Please Input .png,.jpeg,.jpg File")
      return
    }
    console.log("start upload IMAGE")
    // The storage path
    const path = `thumbnail/${Date.now()}_${file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task2 = this.storage.upload(path, file);

    // Progress monitoring
    this.percentage2 = this.task2.percentageChanges();
    console.log("dikit lg masuk finalize");

    // this.snapshot2   = this.task2.snapshotChanges().pipe(
    //   tap(console.log),
    //   // The file's download URL
    //   finalize( async() =>  {
    //     console.log("dikit lg masuk finalize");
    //     this.uploadedThumbURl = await ref.getDownloadURL().toPromise();
    //     console.log(this.uploadedThumbURl)
    //     console.log("KKWKKWKKKW")
    //     alert("Thumbnail Uploaded")
    //   }),
    // );

    this.task2.then(async res => await ref.getDownloadURL().subscribe(url =>{this.uploadedThumbURl = url}))
  }

  checkFile() : Boolean{
    if(this.nextButton){
      this.nextButton = false
      return true;
    }
      
    else{
      this.nextButton = true
      return false;
    }
      
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
  video_url : String;
  video_title : String;
  video_desc : String;
  video_thumb : String;
  playlist_id : number;
  age_restriction : String;
  location_video : String;
  video_cat : String
  visibility : String;
  premium : String;
  status : String;
  like_count : number;
  dislike_count : number;
  view_count : number;
  user_id : number;
  currentUser : any;

  addVideo(){

    this.video_url = this.downloadURLs
    let ins = document.getElementById("inTit");
    this.video_title = ins.value;
    let desc = document.getElementById("inDesc");
    this.video_desc = desc.value;
    this.video_thumb = this.uploadedThumbURl;
    let play = document.getElementById("inPlay");
    this.playlist_id = play.value
    let age = document.getElementsByName("age");
    if(age[0].checked)
      this.age_restriction = "Yes"
    else
      this.age_restriction = "No"
    let loc = document.getElementById("country");
    this.location_video = loc.value;
    let cat = document.getElementById("cat");
    this.video_cat = cat.value;
    let visi = document.getElementsByName("save");
    // cma cek public private ,gbs schedule
    this.status  = "Published"
    if(visi[0].checked) this.visibility = "Public"
    else if(visi[1].checked) this.visibility = "Private"
    else this.visibility = "Unlisted"
    let pre = document.getElementById("pre");
    if(pre.checked) this.premium = "Yes"
    else this.premium = "No"
    this.like_count = 0
    this.dislike_count = 0
    this.view_count = 0
    
    this.user_id = this.currentUser.user_id
    
    console.log(this.video_url)
    console.log(this.video_title)
    console.log(this.video_desc)
    console.log(this.video_thumb)
    console.log(this.playlist_id)
    console.log(this.age_restriction)
    console.log(this.location_video)
    console.log(this.video_cat)
    console.log(this.status)
    console.log(this.visibility)
    console.log(this.premium)
    console.log(this.dislike_count)
    console.log(this.like_count)
    console.log(this.user_id)
    

    if(this.uploadedVideo){
      let today = new Date();
      console.log(typeof(parseInt(localStorage.getItem("duration"))))
      console.log(parseInt(localStorage.getItem("duration")))
      console.log(today.getDate())
      console.log(today.getMonth()+1)
      console.log(today.getFullYear())
      console.log(today.getHours())
      console.log(today.getMonth())
      console.log(today.getSeconds())
      this.apollo.mutate({
        mutation: gql `
        mutation createVideo (
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
          createVideo(
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
          video_url : this.video_url,
          video_title : this.video_title,
          video_desc : this.video_desc,
          video_cat : this.video_cat,
          video_thumb : this.video_thumb,
          playlist_id : this.playlist_id,
          like_count : this.like_count,
          dislike_count : this.dislike_count,
          age_restriction : this.age_restriction,
          visibility : this.visibility,
          location_video : this.location_video,
          status : this.status,
          premium : this.premium,
          view_count : this.view_count,
          user_id : this.user_id,
          video_duration : parseInt(localStorage.getItem("duration")),
          day : today.getDate(),
          month : today.getMonth()+1,
          year : today.getFullYear(),
          hour : today.getHours(),
          minute : today.getMinutes(),
          second : today.getSeconds(),
          
        },refetchQueries:[{
          query: gql `
          {
            videos{
              video_id
              video_url
              video_title
              video_desc
              video_cat
              video_thumb
              playlist_id
              like_count
              dislike_count
              view_count
              age_restriction
              visibility
              location_video
              status
              premium
              user_id
              video_duration
              day
              month
              year
              hour
              minute
              second
            }
          }
        `
        }]
      }).subscribe((result) => {
  
        alert("Video Uploaded")
        this.router.navigate(["/home"])
      },(error) => {

        console.log('there was an error sending the query', error);
      });
    }
    else{
      alert("Video Not Yet Uploaded!")
    }
  }
  checkUserInDb(){
    let email = JSON.parse(localStorage.getItem("users"))[0].email
    // alert(email);
    this.apollo.watchQuery<any>({
    query: gql `
    query getUserId($email: String!){
    getUserId(email : $email) {
        user_id,
        user_name,
        membership
        }
      }
    `,
    variables:{
    email: email
    }
    }).valueChanges.subscribe(result => {
    console.log("CHECKED")
    this.currentUser = result.data.getUserId
    console.log(this.currentUser)
    })
}


}
