import React, { useState, useCallback } from 'react';
import { CellData, Selection, SpreadsheetData } from '../types/spreadsheet';
import { Toolbar } from './Toolbar';
import { ChartDialog } from './ChartDialog';
import { evaluateFormula } from '../utils/spreadsheet';

const ROWS = 20;
const COLS = 10;

const initializeData = (): SpreadsheetData => {
  return Array(ROWS).fill(null).map(() =>
    Array(COLS).fill(null).map(() => ({ value: '' }))
  );
};

export function Spreadsheet() {
  const [data, setData] = useState<SpreadsheetData>(initializeData());
  const [selection, setSelection] = useState<Selection | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Selection | null>(null);
  const [editing, setEditing] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const getColLabel = (index: number): string => {
    let label = '';
    while (index >= 0) {
      label = String.fromCharCode(65 + (index % 26)) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  const getCellValue = useCallback((row: number, col: number): string => {
    const cell = data[row][col];
    if (!cell.value.startsWith('=')) return cell.value;
    return evaluateFormula(cell.value, (r, c) => getCellValue(r, c));
  }, [data]);

  const handleCellClick = (row: number, col: number, isShiftKey: boolean = false) => {
    if (isShiftKey && selection) {
      setSelectionEnd({ row, col });
    } else {
      setSelection({ row, col });
      setSelectionEnd(null);
    }
    setEditing(false);
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleCellChange = (value: string) => {
    if (!selection) return;
    const newData = [...data];
    newData[selection.row][selection.col] = {
      ...newData[selection.row][selection.col],
      value
    };
    setData(newData);
  };

  const updateCellStyle = useCallback((update: Partial<CellData['style']>) => {
    if (!selection) return;
    const newData = [...data];
    const currentCell = newData[selection.row][selection.col];
    newData[selection.row][selection.col] = {
      ...currentCell,
      style: {
        ...currentCell.style,
        ...update
      }
    };
    setData(newData);
  }, [data, selection]);

  const handleFindAndReplace = (find: string, replace: string) => {
    const newData = data.map(row =>
      row.map(cell => ({
        ...cell,
        value: cell.value.replace(new RegExp(find, 'g'), replace)
      }))
    );
    setData(newData);
  };

  const getSelectedCell = () => {
    if (!selection) return null;
    return data[selection.row][selection.col];
  };

  const getSelectedRange = () => {
    if (!selection) return null;
    if (!selectionEnd) return {
      startRow: selection.row,
      startCol: selection.col,
      endRow: selection.row,
      endCol: selection.col
    };

    return {
      startRow: Math.min(selection.row, selectionEnd.row),
      startCol: Math.min(selection.col, selectionEnd.col),
      endRow: Math.max(selection.row, selectionEnd.row),
      endCol: Math.max(selection.col, selectionEnd.col)
    };
  };

  const getDisplayData = () => {
    return data.map(row => row.map(cell => getCellValue(0, 0)));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toolbar
        activeCell={getSelectedCell()?.style}
        onBoldClick={() => updateCellStyle({ bold: !getSelectedCell()?.style?.bold })}
        onItalicClick={() => updateCellStyle({ italic: !getSelectedCell()?.style?.italic })}
        onAlignChange={(align) => updateCellStyle({ align })}
        onFontSizeChange={(fontSize) => updateCellStyle({ fontSize })}
        onColorChange={(color) => updateCellStyle({ color })}
        onFindAndReplace={handleFindAndReplace}
        onCreateChart={() => setShowChart(true)}
        onHeadingClick={() => {
          const currentCell = getSelectedCell();
          updateCellStyle({ 
            isHeading: !currentCell?.style?.isHeading,
            fontSize: !currentCell?.style?.isHeading ? 24 : 11,
            bold: !currentCell?.style?.isHeading
          });
        }}
      />
      <div className="flex-1 overflow-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="w-12 h-8 bg-gray-100 border border-gray-300"></th>
              {Array(COLS).fill(null).map((_, i) => (
                <th key={i} className="w-24 h-8 bg-gray-100 border border-gray-300 font-normal">
                  {getColLabel(i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="w-12 h-8 bg-gray-100 border border-gray-300 text-center text-sm">
                  {rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => {
                  const selectedRange = getSelectedRange();
                  const isInRange = selectedRange && 
                    rowIndex >= selectedRange.startRow && 
                    rowIndex <= selectedRange.endRow && 
                    colIndex >= selectedRange.startCol && 
                    colIndex <= selectedRange.endCol;
                  
                  const cellStyle = cell.style || {};
                  const displayValue = editing && selection?.row === rowIndex && selection?.col === colIndex 
                    ? cell.value 
                    : getCellValue(rowIndex, colIndex);
                  
                  return (
                    <td
                      key={colIndex}
                      className={`w-24 h-8 border border-gray-300 relative ${
                        isInRange ? 'bg-blue-50' : 'bg-white'
                      }`}
                      onClick={(e) => handleCellClick(rowIndex, colIndex, e.shiftKey)}
                      onDoubleClick={handleDoubleClick}
                    >
                      {editing && selection?.row === rowIndex && selection?.col === colIndex ? (
                        <input
                          type="text"
                          value={cell.value}
                          onChange={(e) => handleCellChange(e.target.value)}
                          className="absolute inset-0 w-full h-full px-2 border-2 border-blue-500 outline-none"
                          autoFocus
                          onBlur={() => setEditing(false)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditing(false);
                            }
                          }}
                        />
                      ) : (
                        <div
                          className={`px-2 w-full h-full flex items-center
                            ${cellStyle.bold ? 'font-bold' : ''}
                            ${cellStyle.italic ? 'italic' : ''}
                            ${
                              cellStyle.align === 'center' ? 'justify-center' :
                              cellStyle.align === 'right' ? 'justify-end' :
                              'justify-start'
                            }
                          `}
                          style={{
                            fontSize: `${cellStyle.fontSize || 11}px`,
                            color: cellStyle.color || '#000000'
                          }}
                        >
                          {displayValue}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showChart && (
        <ChartDialog
          onClose={() => setShowChart(false)}
          data={getDisplayData()}
          selectedRange={getSelectedRange()}
        />
      )}
    </div>
  );
}