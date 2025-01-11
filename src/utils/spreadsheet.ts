export const evaluateFormula = (formula: string, getData: (row: number, col: number) => string): string => {
    // Remove the leading = sign
    const expression = formula.substring(1).toUpperCase();
  
    // Helper function to get numeric value from cell reference
    const getCellValue = (ref: string): number => {
      const col = ref.match(/[A-Z]+/)?.[0];
      const row = ref.match(/\d+/)?.[0];
      
      if (!col || !row) return 0;
      
      const colNum = col.split('').reduce((acc, char) => 
        acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
      const rowNum = parseInt(row) - 1;
      
      const value = getData(rowNum, colNum);
      return isNaN(Number(value)) ? 0 : Number(value);
    };
  
    // Helper function to get cell text value
    const getCellText = (ref: string): string => {
      const col = ref.match(/[A-Z]+/)?.[0];
      const row = ref.match(/\d+/)?.[0];
      
      if (!col || !row) return '';
      
      const colNum = col.split('').reduce((acc, char) => 
        acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
      const rowNum = parseInt(row) - 1;
      
      return getData(rowNum, colNum);
    };
  
    // Helper function to get range of cells
    const getRange = (start: string, end: string): number[] => {
      const startCol = start.match(/[A-Z]+/)?.[0];
      const startRow = start.match(/\d+/)?.[0];
      const endCol = end.match(/[A-Z]+/)?.[0];
      const endRow = end.match(/\d+/)?.[0];
      
      if (!startCol || !startRow || !endCol || !endRow) return [];
      
      const values: number[] = [];
      const startColNum = startCol.split('').reduce((acc, char) => 
        acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
      const endColNum = endCol.split('').reduce((acc, char) => 
        acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
      
      for (let row = parseInt(startRow); row <= parseInt(endRow); row++) {
        for (let col = startColNum; col <= endColNum; col++) {
          const value = getData(row - 1, col);
          if (!isNaN(Number(value))) {
            values.push(Number(value));
          }
        }
      }
      
      return values;
    };
  
    // Helper function to get text range
    const getTextRange = (start: string, end: string): string[] => {
      const startCol = start.match(/[A-Z]+/)?.[0];
      const startRow = start.match(/\d+/)?.[0];
      const endCol = end.match(/[A-Z]+/)?.[0];
      const endRow = end.match(/\d+/)?.[0];
      
      if (!startCol || !startRow || !endCol || !endRow) return [];
      
      const values: string[] = [];
      const startColNum = startCol.split('').reduce((acc, char) => 
        acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
      const endColNum = endCol.split('').reduce((acc, char) => 
        acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
      
      for (let row = parseInt(startRow); row <= parseInt(endRow); row++) {
        for (let col = startColNum; col <= endColNum; col++) {
          values.push(getData(row - 1, col));
        }
      }
      
      return values;
    };
  
    try {
      // Existing functions
      if (expression.startsWith('SUM(')) {
        const args = expression.slice(4, -1).split(',');
        let sum = 0;
        
        for (const arg of args) {
          if (arg.includes(':')) {
            const [start, end] = arg.split(':');
            sum += getRange(start.trim(), end.trim()).reduce((a, b) => a + b, 0);
          } else {
            sum += getCellValue(arg.trim());
          }
        }
        
        return sum.toString();
      }
      
      if (expression.startsWith('AVG(') || expression.startsWith('AVERAGE(')) {
        const args = expression.replace(/^(AVG|AVERAGE)\(/, '').slice(0, -1).split(',');
        let values: number[] = [];
        
        for (const arg of args) {
          if (arg.includes(':')) {
            const [start, end] = arg.split(':');
            values = values.concat(getRange(start.trim(), end.trim()));
          } else {
            values.push(getCellValue(arg.trim()));
          }
        }
        
        const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        return avg.toFixed(2);
      }
      
      if (expression.startsWith('MIN(')) {
        const args = expression.slice(4, -1).split(',');
        let values: number[] = [];
        
        for (const arg of args) {
          if (arg.includes(':')) {
            const [start, end] = arg.split(':');
            values = values.concat(getRange(start.trim(), end.trim()));
          } else {
            values.push(getCellValue(arg.trim()));
          }
        }
        
        return Math.min(...values).toString();
      }
      
      if (expression.startsWith('MAX(')) {
        const args = expression.slice(4, -1).split(',');
        let values: number[] = [];
        
        for (const arg of args) {
          if (arg.includes(':')) {
            const [start, end] = arg.split(':');
            values = values.concat(getRange(start.trim(), end.trim()));
          } else {
            values.push(getCellValue(arg.trim()));
          }
        }
        
        return Math.max(...values).toString();
      }
  
      // New Data Quality Functions
      if (expression.startsWith('TRIM(')) {
        const cell = expression.slice(5, -1);
        return getCellText(cell).trim();
      }
  
      if (expression.startsWith('UPPER(')) {
        const cell = expression.slice(6, -1);
        return getCellText(cell).toUpperCase();
      }
  
      if (expression.startsWith('LOWER(')) {
        const cell = expression.slice(6, -1);
        return getCellText(cell).toLowerCase();
      }
  
      if (expression.startsWith('REMOVE_DUPLICATES(')) {
        const range = expression.slice(17, -1);
        if (range.includes(':')) {
          const [start, end] = range.split(':');
          const values = getTextRange(start.trim(), end.trim());
          return [...new Set(values)].join(', ');
        }
        return getCellText(range);
      }
  
      if (expression.startsWith('FIND_AND_REPLACE(')) {
        const args = expression.slice(16, -1).split(',');
        if (args.length === 3) {
          const [cell, find, replace] = args.map(arg => arg.trim());
          const text = getCellText(cell);
          // Remove quotes if they exist
          const findText = find.replace(/^["']|["']$/g, '');
          const replaceText = replace.replace(/^["']|["']$/g, '');
          return text.replace(new RegExp(findText, 'g'), replaceText);
        }
        return '#ERROR: Invalid arguments';
      }
      
      return formula;
    } catch (error) {
      return '#ERROR!';
    }
  };
  
  // Data Validation Helper
  export const validateData = (value: string, rules: {
    type?: 'text' | 'number' | 'date';
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  }): boolean => {
    if (rules.required && !value) {
      return false;
    }
  
    if (rules.type === 'number') {
      const num = Number(value);
      if (isNaN(num)) return false;
      if (rules.min !== undefined && num < rules.min) return false;
      if (rules.max !== undefined && num > rules.max) return false;
    }
  
    if (rules.type === 'date') {
      const date = new Date(value);
      if (date.toString() === 'Invalid Date') return false;
    }
  
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      return false;
    }
  
    return true;
  };