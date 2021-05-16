import { useAnimation } from '@angular/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UseServiceModule } from './use-service.module';
import { UseServiceComponent } from './use-service/use-service.component';

const routes: Routes = [
  {
    path: '',
    component: UseServiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UseServiceRoutingModule {}
