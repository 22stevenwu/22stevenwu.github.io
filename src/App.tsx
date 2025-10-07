import React from 'react';
import './App.css';
import { About } from './components/About';
import Home from './components/Home';
import Experience from './components/Experience';
import Contact from './components/Contact';

function App() {
  return (
    <div className="App">
      <Home />
      <About />
      <Experience />
      <Contact />
    </div>
  );
}

export default App;
