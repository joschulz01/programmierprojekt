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
    path: '', //or.tool.de
    component: HomeComponent,
  },
  {
    path: 'highs', //or-tool.de/highs
    component: HighsSolverComponent
  },
  {
    path: 'datenschutz', //or-tool.de/datenschutz
    component: DatenschutzComponent
  },
  {
    path: 'impressum', //or-tool.de/impressum
    component: ImpressumComponent
  },
  {
    path: 'about-us', //or-tool.de/ueber-uns
    component: AboutUsComponent
  },
  {
    path: 'feedback', //or-tool.de/feedback
    component: FeedbackComponent
  },
  {
    path: 'parameter', //or-tool.de/parameter
    component: ParameterComponent
  } 
];
