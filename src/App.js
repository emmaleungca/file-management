import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FileProcessor from './components/FileProcessor';
import PdfMetadataExtractor from './components/PdfMetadataExtractor';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>PDF Tools</h1>
          <nav>
            <ul>
              <li className="App-Tab"><Link to="/">PDF Splitter</Link></li>
              <li className="App-Tab"><Link to="/metadata-extractor">Metadata Extractor</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<FileProcessor />} />
            <Route path="/metadata-extractor" element={<PdfMetadataExtractor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
