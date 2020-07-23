import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-trend-content',
  templateUrl: './trend-content.component.html',
  styleUrls: ['./trend-content.component.sass']
})
export class TrendContentComponent implements OnInit {
  message : Boolean;

  constructor(private data : DataServiceService) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message =>this.message = message)
  }

}
