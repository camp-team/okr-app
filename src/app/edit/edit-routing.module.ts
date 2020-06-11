import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { ManageComponent } from '../manage/manage/manage.component';
import { Z_FULL_FLUSH } from 'zlib';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRoutingModule {}
