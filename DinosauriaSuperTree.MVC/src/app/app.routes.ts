import { Routes } from '@angular/router';
import { TestComponent } from './components/ui/testGround/test/test.component';
import { AddCladeComponent } from './components/ui/add/clade/add-clade.component';
import { RoundCladogramComponent } from './components/trees/round-cladogram/round-cladogram.component';

export const routes: Routes = [
    {
    path:'',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path:'home',
    component: RoundCladogramComponent  
  },
  {
    path:'add-clade',
    component: AddCladeComponent
  }
];