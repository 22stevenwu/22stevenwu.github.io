import React from 'react';
import Navbar from './components/Navbar';
import { About } from './components/About';
import Home from './components/Home';
import Experience from './components/Experience';
import Contact from './components/Contact';
import GlobalBackground from './components/GlobalBackground';
import Projects from './components/Projects';

function App() {
  return (
    <div className="App">
      <GlobalBackground />
      <Navbar />
      <Home />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </div>
  );
}

export default App;
