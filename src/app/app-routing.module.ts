import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { RboSelectComponent } from './shared/components/rbo-select/rbo-select.component';

const appRoutes: Routes = [
  {
    path: 'selectrbo',
    component: RboSelectComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/items',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
