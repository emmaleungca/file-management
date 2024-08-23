import React from 'react';
import FileProcessor from './components/FileProcessor';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>PDF Splitter and Renamer</h1>
      </header>
      <main>
        <FileProcessor />
      </main>
    </div>
  );
}

export default App;
