# Google Sheet UI Clone with Basic User Interactivity

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

A basic web-based spreadsheet application with user interactivity, inspired by Google Sheets.

## Features

- **Text Formatting**
  - Bold and italic text styling
  - Custom font colors
  - Professional text manipulation tools

- **Find and Replace**
  - Quick search functionality
  - Efficient text replacement
  - Seamless content editing

- **Basic Math Functions**
  - SUM: Calculate totals across cell ranges
  - AVERAGE: Compute mean values
  - MIN: Find minimum values
  - MAX: Find maximum values

- **Charting Capabilities**
  - Multiple chart types: Line, Bar, and Pie
  - Interactive chart creation
  - Dynamic data visualization
  - Legend and tooltip support

- **User-Friendly Interface**
  - Intuitive controls
  - Clean, modern layout
  - Responsive design

## Tech Stack

**Built with:**
- React
- TypeScript
- Tailwind CSS

## Installation

Follow these steps to install the project:

```bash
# Clone the repository
git clone https://github.com/sanikaap/Google-Sheet-UI.git

# Navigate to project directory
cd Directory

# Install dependencies
npm install

# Start development server
npm run dev
```

## User Guide

### Basic Operations
1. Double-click any cell to begin data entry
2. Use the toolbar to access formatting options
3. Select cells to perform operations

### Using Math Functions
1. Enter data into cells
2. Use function syntax in target cell:
   - SUM: `=SUM(A1:A5)`
   - AVERAGE: `=AVG(A1:A5)`
   - MIN: `=MIN(A1:A5)`
   - MAX: `=MAX(A1:A5)`

### Creating Charts
## Install dependencies for chart
```bash
npm install chart.js @types/chart.js
```
1. **Select Data**
   - Use Shift + Click to select a range of cells
   - First row is used for labels
   - Subsequent rows become data series

2. **Generate Chart**
   - Click the chart button in the toolbar
   - Choose chart type (Line, Bar, or Pie)
   - View your data visualization with interactive tooltips and legend

3. **Customize Display**
   - Switch between chart types
   - Charts update automatically with data changes