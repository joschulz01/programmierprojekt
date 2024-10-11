import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UmformungService {
  umformen(LP: string): string {
    // Eingabe-String parsen
    const lines = LP.split('\n').map(line => line.trim()).filter(line => line);
    const variablen = new Set<string>(); // Speichert die Variablen
    let zielfunktion = ''; // Zielfunktion als string
    const nebenbedingungen: string[] = []; // Array von Nebenbedingungen

    // Durch die Zeilen iterieren und Informationen extrahieren
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Variablen aus Nebenbedingungen oder Zielfunktion extrahieren
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
    const formatierteZielfunktion = this.formatZielfunktion(zielfunktion);
    ausgabe.push(`  ${formatierteZielfunktion}`);

    // Nebenbedingungen formatieren
    ausgabe.push(`Subject To`);
    nebenbedingungen.forEach(nb => {
      const formatierteNB = this.formatNebenbedingung(nb);
      ausgabe.push(`  ${formatierteNB}`);
    });

    // Alles zusammenfügen
    ausgabe.push(`End`);

    return ausgabe.join('\n');
  }
  umformenxy(LP: string): string {
    // Eingabe-String parsen
    const lines = LP.split('\n').map(line => line.trim()).filter(line => line);
    const variablen = new Set<string>(); // Speichert die Variablen
    let zielfunktion = ''; // Zielfunktion als string
    const nebenbedingungen: string[] = []; // Array von Nebenbedingungen

    // Durch die Zeilen iterieren und Informationen extrahieren
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Variablen aus Nebenbedingungen oder Zielfunktion extrahieren
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
    const formatierteZielfunktion = this.formatZielfunktion2(zielfunktion);
    ausgabe.push(`  ${formatierteZielfunktion}`);

    // Nebenbedingungen formatieren
    ausgabe.push(`Subject To`);
    nebenbedingungen.forEach(nb => {
      const formatierteNB = this.formatNebenbedingung2(nb);
      ausgabe.push(`  ${formatierteNB}`);
    });

    // Alles zusammenfügen
    ausgabe.push(`End`);

    return ausgabe.join('\n');
  }

  // Methode zur Extraktion der Variablen aus einer Zeile
  private extractVariablen(line: string, variablen: Set<string>): void {
    const variableRegex = /([a-zA-Z]\d*)/g;
    let match: RegExpExecArray | null;
    while ((match = variableRegex.exec(line)) !== null) {
      variablen.add(match[1]); // Gefundene Variable zu Set hinzufügen
    }
  }

  // Formatierung der Zielfunktion
  private formatZielfunktion(zielfunktion: string): string {
    return zielfunktion
      .replace(/;/g, '')           // Semikolon entfernen
      .replace(/\*/g, ' ')         // '*' durch Leerzeichen ersetzen
      .replace(/\s*\+\s*/g, ' + ') // Sicherstellen, dass um '+' herum Leerzeichen sind
      .replace(/([a-zA-Z])(\d+)/g, '$1$2'); // Entfernt Leerzeichen zwischen Variablen und Zahlen
      
  }
  // Formatierung der Zielfunktion
  private formatZielfunktion2(zielfunktion: string): string {
    return zielfunktion
      .replace(/;/g, '')           // Semikolon entfernen
      .replace(/\*/g, ' ')         // '*' durch Leerzeichen ersetzen
      .replace(/\s*\+\s*/g, ' + ') // Sicherstellen, dass um '+' herum Leerzeichen sind
      .replace(/([a-zA-Z])(\d+)/g, '$1$2') // Entfernt Leerzeichen zwischen Variablen und Zahlen
      .replace(/\bx\b/g, 'x1')  
      .replace(/\by\b/g, 'x2');
  }

  // Formatierung der Nebenbedingungen
  private formatNebenbedingung(nebenbedingung: string): string {
    return nebenbedingung
      .replace(/;/g, '')           // Semikolon entfernen
      .replace(/\*/g, ' ')         // '*' durch Leerzeichen ersetzen
      .replace(/\s*\+\s*/g, ' + ') // Sicherstellen, dass um '+' herum Leerzeichen sind
      .replace(/([a-zA-Z])(\d+)/g, '$1$2'); // Entfernt Leerzeichen zwischen Variablen und Zahlen
     
  }
  // Formatierung der Nebenbedingungen
  private formatNebenbedingung2(nebenbedingung: string): string {
    return nebenbedingung
      .replace(/;/g, '')           // Semikolon entfernen
      .replace(/\*/g, ' ')         // '*' durch Leerzeichen ersetzen
      .replace(/\s*\+\s*/g, ' + ') // Sicherstellen, dass um '+' herum Leerzeichen sind
      .replace(/([a-zA-Z])(\d+)/g, '$1$2') // Entfernt Leerzeichen zwischen Variablen und Zahlen
      .replace(/\bx\b/g, 'x1')  
      .replace(/\by\b/g, 'x2');
  }
}
  