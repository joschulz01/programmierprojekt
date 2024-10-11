import { Routes } from '@angular/router';

import { AboutUsComponent } from "./footer/about-us/about-us.component";
import { DatenschutzComponent } from "./footer/datenschutz/datenschutz.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { HighsSolverComponent} from "./highs-solver/highs-solver.component";
import { HomeComponent } from './home/home.component';
import { ImpressumComponent } from "./footer/impressum/impressum.component";
import { ParameterComponent } from './parameter/parameter.component';




export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'highs',
    component: HighsSolverComponent
  },
  {
    path: 'datenschutz',
    component: DatenschutzComponent
  },
  {
    path: 'impressum',
    component: ImpressumComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },
  {
    path: 'feedback',
    component: FeedbackComponent
  },
  {
    path: 'parameter',
    component: ParameterComponent
  } 
];
