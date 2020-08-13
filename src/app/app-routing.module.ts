import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrendingContentComponent } from './trending-content/trending-content.component';
import { SubscriptionContentComponent } from './subscription-content/subscription-content.component';
import { MusicCategoryComponent } from './music-category/music-category.component';
import { SportCategoryComponent } from './sport-category/sport-category.component';
import { YtPremiumComponent } from './yt-premium/yt-premium.component';
import { AddVideoComponent } from './add-video/add-video.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { ChannelComponent } from './channel/channel.component';
import { VideoChannelComponent } from './video-channel/video-channel.component';
import { StudioComponent } from './studio/studio.component';
import { EditVideoComponent } from './edit-video/edit-video.component';
import { GamingCatComponent } from './gaming-cat/gaming-cat.component';
import { NewscatComponent } from './newscat/newscat.component';
import { TravellingcatComponent } from './travellingcat/travellingcat.component';
import { EntertainmentcatComponent } from './entertainmentcat/entertainmentcat.component';
import { SearchComponent } from './search/search.component';
import { PlayQComponent} from './play-q/play-q.component';
import { CommunityComponent} from './community/community.component'
import { AboutchanComponent} from './aboutchan/aboutchan.component'
 
const routes: Routes = [
  {path:"", redirectTo:"/home", pathMatch: 'full'},
  {path:"home",component : HomeComponent},
  {path:"trending",component : TrendingContentComponent},
  {path:"subscription",component:SubscriptionContentComponent},
  {path:"category/music",component:MusicCategoryComponent},
  {path:"category/sport",component:SportCategoryComponent},
  {path:"category/gaming",component:GamingCatComponent},
  {path:"category/news",component:NewscatComponent},
  {path:"category/travelling",component:TravellingcatComponent},
  {path:"category/enter",component:EntertainmentcatComponent},
  {path:"premium",component:YtPremiumComponent},
  {path:"create",component:AddVideoComponent},
  // {path:"uploadDetail",component:UploadDetailComponent},
  {path:"videoPlayer/:vidId",component:VideoDetailComponent},
  {path:"playlist/:playlist_id",component:PlaylistComponent},
  {path:"channel/:user_id",component:ChannelComponent},
  {path:"videoChannel/:user_id",component:VideoChannelComponent},
  {path:"playChannel/:user_id",component:PlayQComponent},
  {path:"studio/:user_id",component:StudioComponent},
  {path:"edit/:video_id",component:EditVideoComponent},
  {path:"search/:value",component:SearchComponent},
  {path:"play",component:PlayQComponent},
  {path:"comChannel/:user_id",component:CommunityComponent},
  {path:"aboutChannel/:user_id",component:AboutchanComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
