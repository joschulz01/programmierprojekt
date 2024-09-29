import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HighsSolverComponent } from './highs-solver/highs-solver.component'; // Standalone-Komponente
import { FeedbackComponent } from './feedback/feedback.component'; // Standalone-Komponente

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HighsSolverComponent, // Standalone-Komponente hier importieren
    FeedbackComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
