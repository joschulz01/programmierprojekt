import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UmformungService {
  constructor (){};  
  umformen(LP: string): string {
    // Parsing the input string
    const lines = LP.split('\n').map(line => line.trim()).filter(line => line);
    let variables: string[] = [];
    let objective: string = '';
    let constraints: string[] = [];

    // Loop through the lines and extract information
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Extract variables
      if (line.startsWith('var')) {
        const vars = line.match(/var (.+);/);
        if (vars) {
          variables = vars[1].split(',').map(v => v.trim());
        }
      }
      
      // Extract objective
      if (line.startsWith('maximize')) {
        objective = line.replace('maximize Objective:', '').trim();
      }

      // Extract constraints
      if (line.startsWith('s.t.')) {
        if (i + 1 < lines.length) { // Ensure there is a next line
          const nextLine = lines[i + 1].trim(); // Get the next line as constraint
          constraints.push(nextLine);
          i++; // Skip the next line as it's already used
        }
      }
    }

    // Prepare the output format
    const output = [];

    // Format Objective
    output.push(`Maximize`);
    const formattedObjective = this.formatObjective(objective, variables);
    output.push(`  ${formattedObjective}`);

    // Format Subject To (Constraints)
    output.push(`Subject To`);
    constraints.forEach((constraint, index) => {
      const formattedConstraint = this.formatConstraint(constraint, variables);
      output.push(`  ${formattedConstraint}`);
    });

   

    // Combine everything
    output.push(`End`);

    return output.join('\n');
  }

  private formatObjective(objective: string, variables: string[]): string {
    // Remove semicolon, replace * with space, and ensure space between variables and coefficients
    return objective
      .replace(';', '')          // Remove semicolon
      .replace(/\*/g, ' ')       // Replace '*' with space
      .replace(/\s*\+\s*/g, ' + ')  // Ensure proper spacing around '+'
      .replace(/([a-z])(\d*)/g, '$1 $2');  // Ensure spacing between variable and number
  }

  private formatConstraint(constraint: string, variables: string[]): string {
    // Ensure spaces between variables and coefficients, remove semicolons, replace '*' with spaces
    return constraint
      .replace(';', '')          // Remove semicolon
      .replace(/\*/g, ' ')       // Replace '*' with space
      .replace(/\s*\+\s*/g, ' + ')  // Ensure proper spacing around '+'
      .replace(/([a-z])(\d*)/g, '$1 $2');  // Ensure spacing between variable and number
  }
}