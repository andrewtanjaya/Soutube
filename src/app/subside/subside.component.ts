import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-subside',
  templateUrl: './subside.component.html',
  styleUrls: ['./subside.component.sass']
})
export class SubsideComponent implements OnInit {
@Input() sub : {userId : number, subs_id : number, subscriber_id : number}
user : any

  constructor(private apollo : Apollo) { }
  ngOnInit(): void {
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
        user_id: this.sub.user_id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
      
    })
  }

}
