import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { DataServiceService } from '../data-service.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-yt-premium-content',
  templateUrl: './yt-premium-content.component.html',
  styleUrls: ['./yt-premium-content.component.sass']
})
export class YtPremiumContentComponent implements OnInit {
  email : any;
  histories : any;
  constructor(private apollo : Apollo) { }
  user : any;
  ngOnInit(): void {
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
      this.user = result.data.getUserId
      this.apollo.watchQuery<any>({
        query: gql `
        query histories ($user_id : Int!) {
          histories(user_id: $user_id) {
            id,
            types,
            startDate,
            endDate
          }
        }
        `,
        variables:{
            user_id : this.user.user_id,
        }
      }).valueChanges.subscribe(result => {
        // alert(this.comment.comment_id)
        this.histories = result.data.histories
        
       console.log(this.histories)
      });
     console.log(this.user)
    });
  }

  premium(){
    
    if(document.getElementById("year").checked){
      this.apollo.mutate({
        mutation: gql `
    
        mutation updatePremiumYear (
                $user_id : Int!,
                
        ) {
          updatePremiumYear(
            user_id : $user_id 
          ){
            user_id,
          }
        } 
        `,
        variables:{
          user_id : this.user.user_id
        }
      }).subscribe((result) => {
        window.location.reload();
        this.apollo.mutate({
          mutation: gql `
          mutation createHistory( $types : String!, $user_id : Int!){
            createHistory(
              input : {
                user_id : $user_id,
                types : $types
              }
            ){
              id,
            }
          }
          `,
          variables:{
            user_id : this.user.user_id,
            types : "Annualy"
          }
        }).subscribe(result => {
          
        });

      },(error) => {
    
        console.log('there was an error sending the query', error);
      });
    }
    else if(document.getElementById("mon").checked){
      this.apollo.mutate({
        mutation: gql `
    
        mutation updatePremium (
                $user_id : Int!,
                
        ) {
          updatePremium(
            user_id : $user_id 
          ){
            user_id,
          }
        } 
        `,
        variables:{
          user_id : this.user.user_id
        }
      }).subscribe((result) => {
        window.location.reload();
        this.apollo.mutate({
          mutation: gql `
          mutation createHistory( $types : String!, $user_id : Int!){
            createHistory(
              input : {
                user_id : $user_id,
                types : $types
              }
            ){
              id,
            }
          }
          `,
          variables:{
            user_id : this.user.user_id,
            types : "Monthly"
          }
        }).subscribe(result => {
          
        });
      },(error) => {
    
        console.log('there was an error sending the query', error);
      });
    }
  }
  makeDate(tgl : string){
    return new Date(tgl)
  }
}
