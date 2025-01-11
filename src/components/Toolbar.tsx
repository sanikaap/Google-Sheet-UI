import React, { useState } from 'react';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Type, Heading1, Search, Replace } from 'lucide-react';

interface ToolbarProps {
  onBoldClick: () => void;
  onItalicClick: () => void;
  onAlignChange: (align: 'left' | 'center' | 'right') => void;
  onFontSizeChange: (size: number) => void;
  onColorChange: (color: string) => void;
  onHeadingClick: () => void;
  onFindAndReplace?: (find: string, replace: string) => void;
  activeCell?: {
    bold?: boolean;
    italic?: boolean;
    align?: 'left' | 'center' | 'right';
    fontSize?: number;
    color?: string;
    isHeading?: boolean;
  };
}

export function Toolbar({ 
  onBoldClick, 
  onItalicClick, 
  onAlignChange, 
  onFontSizeChange,
  onColorChange,
  onHeadingClick,
  onFindAndReplace,
  activeCell 
}: ToolbarProps) {
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const handleFindReplace = () => {
    if (onFindAndReplace) {
      onFindAndReplace(findText, replaceText);
      setFindText('');
      setReplaceText('');
      setShowFindReplace(false);
    }
  };

  return (
    <div className="flex flex-col bg-white border-b">
      <div className="flex items-center gap-2 p-2">
        <button
          onClick={onHeadingClick}
          className={`p-2 rounded hover:bg-gray-100 ${
            activeCell?.isHeading ? 'bg-gray-200' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <select
          className="h-8 px-2 border rounded"
          value={activeCell?.fontSize || 11}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
        >
          {FONT_SIZES.map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>

        <select
          className="h-8 px-2 border rounded w-24"
          value={activeCell?.color || '#000000'}
          onChange={(e) => onColorChange(e.target.value)}
          style={{ color: activeCell?.color || '#000000' }}
        >
          {COLORS.map(color => (
            <option key={color} value={color} style={{ color }}>
              {color}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          onClick={onBoldClick}
          className={`p-2 rounded hover:bg-gray-100 ${
            activeCell?.bold ? 'bg-gray-200' : ''
          }`}
        >
          <Bold size={18} />
        </button>
        <button
          onClick={onItalicClick}
          className={`p-2 rounded hover:bg-gray-100 ${
            activeCell?.italic ? 'bg-gray-200' : ''
          }`}
        >
          <Italic size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          onClick={() => onAlignChange('left')}
          className={`p-2 rounded hover:bg-gray-100 ${
            activeCell?.align === 'left' ? 'bg-gray-200' : ''
          }`}
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => onAlignChange('center')}
          className={`p-2 rounded hover:bg-gray-100 ${
            activeCell?.align === 'center' ? 'bg-gray-200' : ''
          }`}
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={() => onAlignChange('right')}
          className={`p-2 rounded hover:bg-gray-100 ${
            activeCell?.align === 'right' ? 'bg-gray-200' : ''
          }`}
        >
          <AlignRight size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          onClick={() => setShowFindReplace(!showFindReplace)}
          className={`p-2 rounded hover:bg-gray-100 flex items-center gap-1 ${
            showFindReplace ? 'bg-gray-200' : ''
          }`}
        >
          <Search size={18} />
          <Replace size={18} />
          <span className="text-sm">Find & Replace</span>
        </button>
      </div>

      {showFindReplace && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 border-t">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Find:</label>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="h-8 px-2 border rounded"
              placeholder="Text to find"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Replace:</label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="h-8 px-2 border rounded"
              placeholder="Replace with"
            />
          </div>
          <button
            onClick={handleFindReplace}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!findText}
          >
            Replace All
          </button>
        </div>
      )}
    </div>
  );
}

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32];
const COLORS = [
  '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FF00FF', '#00FFFF', '#FFFF00', '#808080'
];