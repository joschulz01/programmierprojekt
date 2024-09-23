import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SolverComponent } from './highssolver/highssolver.component'; // Standalone-Komponente

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SolverComponent // Standalone-Komponente hier importieren
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
