import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit {
  randomize : any;
  message : Boolean;
  videos : any;
  seconds : any;
  lastIndex = 12;
  observer : any;
  constructor(private data : DataServiceService,private apollo : Apollo ) { }

  ngOnInit(): void {
    if(localStorage.getItem("queue")){
      localStorage.removeItem("queue")
    }
    // this.data.changePlay(null)
    this.observer = new IntersectionObserver((entry)=>{
      if(entry[0].isIntersecting){
        let card = document.querySelector(".container");
        for(let i:number=0;i<4;i++){
          if(this.lastIndex < this.videos.length){
            let div = document.createElement("div");
            let video = document.createElement("app-cards")
            video.setAttribute("video","this.videos[this.lastIndex]");
            div.appendChild(video);
            card.appendChild(div);
            this.lastIndex++
          }
        }
      }
    });
    this.observer.observe(document.querySelector(".footer"));
    let today = new Date()
    this.data.currentMessage.subscribe(message =>this.message = message)
    this.apollo
      .watchQuery({
        query: gql`
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
        `,
      })
      .valueChanges.subscribe(result => {
        this.videos = result.data.videos;
        this.getRandom();
      });
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

}
