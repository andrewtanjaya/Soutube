import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-sub-content',
  templateUrl: './sub-content.component.html',
  styleUrls: ['./sub-content.component.sass']
})
export class SubContentComponent implements OnInit {

  message : Boolean;
  constructor(private data : DataServiceService) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message =>this.message = message)
  }

}
