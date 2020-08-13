import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { ContentComponent } from './content/content.component';
import { CardsComponent } from './content/cards/cards.component';
import { TrendContentComponent } from './trend-content/trend-content.component';
import { TrendingContentComponent } from './trending-content/trending-content.component';
import { CardContentComponent } from './trend-content/card-content/card-content.component';
import { SubscriptionContentComponent } from './subscription-content/subscription-content.component';
import { SubContentComponent } from './sub-content/sub-content.component';
import { MusicCategoryComponent } from './music-category/music-category.component';
import { MusicCategoryDetailComponent } from './music-category-detail/music-category-detail.component';
import { SportCategoryComponent } from './sport-category/sport-category.component';
import { SportCategoryDetailComponent } from './sport-category-detail/sport-category-detail.component';
import { YtPremiumContentComponent } from './yt-premium-content/yt-premium-content.component';
import { YtPremiumComponent } from './yt-premium/yt-premium.component';
import { AddVideoComponent } from './add-video/add-video.component';
import { AddVideoContentComponent } from './add-video-content/add-video-content.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { VideoDetailContentComponent } from './video-detail-content/video-detail-content.component';
import { CommentsComponent } from './comments/comments.component';
import { SideQueueComponent } from './side-queue/side-queue.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlaylistContentComponent } from './playlist-content/playlist-content.component';
import {AngularFireModule} from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule, AngularFireStorage } from 'angularfire2/storage';
import { environment } from '../environments/environment'
// import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import {DragDropModule} from '@angular/cdk/drag-drop';

//matvideo

import { MatVideoModule } from 'mat-video';

//googleSignIn
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
} from 'angularx-social-login';
import { SignInComponent } from './sign-in/sign-in.component';
import { DropZoneDirective } from './drop-zone.directive';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChannelComponent } from './channel/channel.component';
import { ChannelContentComponent } from './channel-content/channel-content.component';
import { ReplyComponent } from './reply/reply.component';
import { ScrollableDirective } from './scrollable.directive';
import { CardsideComponent } from './cardside/cardside.component';
import { CardChannelComponent } from './card-channel/card-channel.component';
import { VideoChannelComponent } from './video-channel/video-channel.component';
import { CardVideoChannelComponent } from './card-video-channel/card-video-channel.component';
import { StudioComponent } from './studio/studio.component';
import { StudioContentComponent } from './studio-content/studio-content.component';
import { StudiocardComponent } from './studiocard/studiocard.component';
import { EditVideoComponent } from './edit-video/edit-video.component';
import { EditVideoContentComponent } from './edit-video-content/edit-video-content.component';
import { SubsideComponent } from './subside/subside.component';
import { GamingCatComponent } from './gaming-cat/gaming-cat.component';
import { GamingCatDetailComponent } from './gaming-cat-detail/gaming-cat-detail.component';
import { NewscatComponent } from './newscat/newscat.component';
import { NewcatdetailComponent } from './newcatdetail/newcatdetail.component';
import { TravellingcatComponent } from './travellingcat/travellingcat.component';
import { TravellingcatdetailComponent } from './travellingcatdetail/travellingcatdetail.component';
import { EntertainmentcatComponent } from './entertainmentcat/entertainmentcat.component';
import { EntertainmentcatdetailComponent } from './entertainmentcatdetail/entertainmentcatdetail.component';
import { PlaycardComponent } from './playcard/playcard.component';
import { SearchComponent } from './search/search.component';
import { SearchcontentComponent } from './searchcontent/searchcontent.component';
import { SearchPlayComponent } from './search-play/search-play.component';
import { SearchvideoComponent } from './searchvideo/searchvideo.component';
import { SubspageComponent } from './subspage/subspage.component';
import { SearchChannelComponent } from './search-channel/search-channel.component';
import { PlayQComponent } from './play-q/play-q.component';
import { PlayQContentComponent } from './play-qcontent/play-qcontent.component';
import { CommunityComponent } from './community/community.component';
import { CommunitycardComponent } from './communitycard/communitycard.component';
import { FbLikeComponent } from './fb-like/fb-like.component';
import { AboutchanComponent } from './aboutchan/aboutchan.component';
//untilHere

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SideBarComponent,
    ContentComponent,
    CardsComponent,
    TrendContentComponent,
    TrendingContentComponent,
    CardContentComponent,
    SubscriptionContentComponent,
    SubContentComponent,
    MusicCategoryComponent,
    MusicCategoryDetailComponent,
    SportCategoryComponent,
    SportCategoryDetailComponent,
    YtPremiumContentComponent,
    YtPremiumComponent,
    AddVideoComponent,
    AddVideoContentComponent,
    VideoDetailComponent,
    VideoDetailContentComponent,
    CommentsComponent,
    SideQueueComponent,
    PlaylistComponent,
    PlaylistContentComponent,
    SignInComponent,
    DropZoneDirective,
    FileUploadComponent,
    ChannelComponent,
    ChannelContentComponent,
    ReplyComponent,
    ScrollableDirective,
    CardsideComponent,
    CardChannelComponent,
    VideoChannelComponent,
    CardVideoChannelComponent,
    StudioComponent,
    StudioContentComponent,
    StudiocardComponent,
    EditVideoComponent,
    EditVideoContentComponent,
    SubsideComponent,
    GamingCatComponent,
    GamingCatDetailComponent,
    NewscatComponent,
    NewcatdetailComponent,
    TravellingcatComponent,
    TravellingcatdetailComponent,
    EntertainmentcatComponent,
    EntertainmentcatdetailComponent,
    PlaycardComponent,
    SearchComponent,
    SearchcontentComponent,
    SearchPlayComponent,
    SearchvideoComponent,
    SubspageComponent,
    SearchChannelComponent,
    PlayQComponent,
    PlayQContentComponent,
    CommunityComponent,
    CommunitycardComponent,
    FbLikeComponent,
    AboutchanComponent
  ],
  imports: [
    MatVideoModule,
    AngularFireModule.initializeApp(environment.firebase),
    SocialLoginModule,
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    DragDropModule,
    // JwSocialButtonsModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '838815110235-h63c2moej3sv2t72abcm4rc4j7psq07q.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
