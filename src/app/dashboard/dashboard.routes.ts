import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard.component';
import { StatisticsComponent } from '../in-outs/statistics/statistics.component';
import { InOutsComponent } from '../in-outs/in-outs.component';
import { DetailComponent } from '../in-outs/detail/detail.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        component: StatisticsComponent,
      },
      {
        path: 'in-outs',
        component: InOutsComponent,
      },
      {
        path: 'detail',
        component: DetailComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
