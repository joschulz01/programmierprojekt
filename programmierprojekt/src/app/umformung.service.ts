import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UmformungService {
  umformen(LP: string): string {
    const lines = LP.split('\n').map(line => line.trim()).filter(line => line);
    const variablen = new Set<string>();
    let zielfunktion = '';
    const nebenbedingungen: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      this.extractVariablen(line, variablen);

      if (line.toLowerCase().startsWith('maximize')) {
        zielfunktion = line.replace(/maximize\s*Objective:/i, '').trim();
      }

      if (line.toLowerCase().startsWith('s.t.')) {
        if (i + 1 < lines.length) { 
          const nextLine = lines[i + 1].trim();
          nebenbedingungen.push(nextLine);
          i++;
        }
      }
    }

    const ausgabe: string[] = [];

    ausgabe.push(`Maximize`);
    const formatierteZielfunktion = this.formatZielfunktion(zielfunktion);
    ausgabe.push(`  ${formatierteZielfunktion}`);

    ausgabe.push(`Subject To`);
    nebenbedingungen.forEach(nb => {
      const formatierteNB = this.formatNebenbedingung(nb);
      ausgabe.push(`  ${formatierteNB}`);
    });

    ausgabe.push(`End`);

    return ausgabe.join('\n');
  }
  umformenxy(LP: string): string {
    const lines = LP.split('\n').map(line => line.trim()).filter(line => line);
    const variablen = new Set<string>();
    let zielfunktion = '';
    const nebenbedingungen: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      this.extractVariablen(line, variablen);

      if (line.toLowerCase().startsWith('maximize')) {
        zielfunktion = line.replace(/maximize\s*Objective:/i, '').trim();
      }

      if (line.toLowerCase().startsWith('s.t.')) {
        if (i + 1 < lines.length) { 
          const nextLine = lines[i + 1].trim();
          nebenbedingungen.push(nextLine);
          i++;
        }
      }
    }

    const ausgabe: string[] = [];

    ausgabe.push(`Maximize`);
    const formatierteZielfunktion = this.formatZielfunktion2(zielfunktion);
    ausgabe.push(`  ${formatierteZielfunktion}`);

    ausgabe.push(`Subject To`);
    nebenbedingungen.forEach(nb => {
      const formatierteNB = this.formatNebenbedingung2(nb);
      ausgabe.push(`  ${formatierteNB}`);
    });

    ausgabe.push(`End`);

    return ausgabe.join('\n');
  }

  private extractVariablen(line: string, variablen: Set<string>): void {
    const variableRegex = /([a-zA-Z]\d*)/g;
    let match: RegExpExecArray | null;
    while ((match = variableRegex.exec(line)) !== null) {
      variablen.add(match[1]);
    }
  }

  private formatZielfunktion(zielfunktion: string): string {
    return zielfunktion
      .replace(/;/g, '')           
      .replace(/\*/g, ' ')         
      .replace(/\s*\+\s*/g, ' + ') 
      .replace(/([a-zA-Z])(\d+)/g, '$1$2');
      
  }
  private formatZielfunktion2(zielfunktion: string): string {
    return zielfunktion
      .replace(/;/g, '')           
      .replace(/\*/g, ' ')         
      .replace(/\s*\+\s*/g, ' + ') 
      .replace(/([a-zA-Z])(\d+)/g, '$1$2') 
      .replace(/\bx\b/g, 'x1')  
      .replace(/\by\b/g, 'x2');
  }

  private formatNebenbedingung(nebenbedingung: string): string {
    return nebenbedingung
      .replace(/;/g, '')           
      .replace(/\*/g, ' ')         
      .replace(/\s*\+\s*/g, ' + ')
      .replace(/([a-zA-Z])(\d+)/g, '$1$2');
     
  }
  private formatNebenbedingung2(nebenbedingung: string): string {
    return nebenbedingung
      .replace(/;/g, '')           
      .replace(/\*/g, ' ')         
      .replace(/\s*\+\s*/g, ' + ') 
      .replace(/([a-zA-Z])(\d+)/g, '$1$2') 
      .replace(/\bx\b/g, 'x1')  
      .replace(/\by\b/g, 'x2');
  }
}
  