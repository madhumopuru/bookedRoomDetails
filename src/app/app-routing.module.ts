import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BookedDetailsComponent } from './booked-details/booked-details.component';
import { CreatemeetingroomComponent } from './createmeetingroom/createmeetingroom.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/createMeetingRoom',
    pathMatch: 'full'
  },
  {
    path: 'createMeetingRoom',
    component: CreatemeetingroomComponent,
  },
  {
    path: 'meetingRoomDetails',
    component: BookedDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
