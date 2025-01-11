export interface CellData {
    value: string;
    style?: {
      bold?: boolean;
      italic?: boolean;
      align?: 'left' | 'center' | 'right';
      fontSize?: number;
      color?: string;
      isHeading?: boolean;
    };
  }
  
  export interface Selection {
    row: number;
    col: number;
  }
  
  export type SpreadsheetData = CellData[][];
  
  export interface CellReference {
    row: number;
    col: number;
  }