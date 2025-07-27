import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import AudioDetection from './AudioDetection';
import Results from './Results';
import History from './History';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<AudioDetection />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;