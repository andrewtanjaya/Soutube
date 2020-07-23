import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-add-video-content',
  templateUrl: './add-video-content.component.html',
  styleUrls: ['./add-video-content.component.sass']
})
export class AddVideoContentComponent implements OnInit {

  message : Boolean
  constructor(private data : DataServiceService) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message =>this.message = message)
  }

}
