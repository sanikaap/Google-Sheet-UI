
import { Spreadsheet } from './components/Spreadsheet';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Spreadsheet />
    </div>
  );
}

export default App;