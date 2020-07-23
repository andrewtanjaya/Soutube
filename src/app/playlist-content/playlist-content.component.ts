import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-playlist-content',
  templateUrl: './playlist-content.component.html',
  styleUrls: ['./playlist-content.component.sass']
})
export class PlaylistContentComponent implements OnInit {
  message : Boolean;
  constructor(private data : DataServiceService) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message =>this.message = message);
  }

}
