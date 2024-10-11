import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HighsSolverComponent } from './highs-solver/highs-solver.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HighsSolverComponent 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
