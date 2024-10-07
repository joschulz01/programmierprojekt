import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Importieren Sie CommonModule
import { AppComponent } from './app.component';
import { HighsSolverComponent } from './highs-solver/highs-solver.component'; // Standalone-Komponente

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HighsSolverComponent, // Standalone-Komponente hier importieren
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
