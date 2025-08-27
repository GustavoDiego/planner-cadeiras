import { Routes } from '@angular/router';
import { HomePage } from './features/schedule/pages/home/home.page';
import { ScheduleResolver } from './core/resolvers/schedule.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    resolve: { schedule: ScheduleResolver },
  },
  { path: '**', redirectTo: '' },
];
