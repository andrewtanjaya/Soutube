import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.sass']
})
export class VideoDetailComponent implements OnInit {

  
  constructor(private apollo : Apollo) { }

  ngOnInit(): void {
    
  }

  
}
