import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UmformungService {
  constructor (){};  

  umformen(LP: string): string {
    // Eingabe-String parsen
    const lines = LP.split('\n').map(line => line.trim()).filter(line => line);
    let variablen: Set<string> = new Set(); // Speichert die Variablen
    let zielfunktion: string = '';
    let nebenbedingungen: string[] = [];

    // Durch die Zeilen iterieren und Informationen extrahieren
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Variablen aus Nebenbedingungen oder Zielfunktion extrahieren (x1, x2, etc.)
      this.extractVariablen(line, variablen);

      // Zielfunktion extrahieren
      if (line.toLowerCase().startsWith('maximize')) {
        zielfunktion = line.replace(/maximize\s*Objective:/i, '').trim();
      }

      // Nebenbedingungen extrahieren
      if (line.toLowerCase().startsWith('s.t.')) {
        if (i + 1 < lines.length) { // Überprüfen, ob es eine nächste Zeile gibt
          const nextLine = lines[i + 1].trim(); // Nächste Zeile als Nebenbedingung holen
          nebenbedingungen.push(nextLine);
          i++; // Nächste Zeile überspringen, da sie bereits verwendet wurde
        }
      }
    }

    // Ausgabe formatieren
    const ausgabe: string[] = [];

    // Zielfunktion formatieren
    ausgabe.push(`Maximize`);
    const formatierteZielfunktion = this.formatZielfunktion(zielfunktion, [...variablen]);
    ausgabe.push(`  ${formatierteZielfunktion}`);

    // Nebenbedingungen formatieren
    ausgabe.push(`Subject To`);
    nebenbedingungen.forEach((nb, index) => {
      const formatierteNB = this.formatNebenbedingung(nb, [...variablen]);
      ausgabe.push(`  ${formatierteNB}`);
    });

    // Alles zusammenfügen
    ausgabe.push(`End`);
    console.log(ausgabe.join('\n'));

    return ausgabe.join('\n');
  }

  // Methode zur Extraktion der Variablen aus einer Zeile
  private extractVariablen(line: string, variablen: Set<string>): void {
    const variableRegex = /([a-zA-Z]\d*)/g;
    let match;
    while ((match = variableRegex.exec(line)) !== null) {
      variablen.add(match[1]); // Gefundene Variable zu Set hinzufügen
    }
  }

  // Formatierung der Zielfunktion
  private formatZielfunktion(zielfunktion: string, variablen: string[]): string {
    return zielfunktion
      .replace(';', '')           // Semikolon entfernen
      .replace(/\*/g, ' ')        // '*' durch Leerzeichen ersetzen
      .replace(/\s*\+\s*/g, ' + ')  // Sicherstellen, dass um '+' herum Leerzeichen sind
      .replace(/([a-zA-Z])(\d+)/g, '$1$2');  // Entfernt Leerzeichen zwischen Variablen und Zahlen
  }

  // Formatierung der Nebenbedingungen
  private formatNebenbedingung(nebenbedingung: string, variablen: string[]): string {
    return nebenbedingung
      .replace(';', '')           // Semikolon entfernen
      .replace(/\*/g, ' ')        // '*' durch Leerzeichen ersetzen
      .replace(/\s*\+\s*/g, ' + ')  // Sicherstellen, dass um '+' herum Leerzeichen sind
      .replace(/([a-zA-Z])(\d+)/g, '$1$2');  // Entfernt Leerzeichen zwischen Variablen und Zahlen
  }
}
