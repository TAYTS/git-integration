import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './components/form';
import OAuth from './components/oauth';

function App() {
  return (
    <div className="min-h-full min-w-full flex justify-center items-center">
      <Router>
        <Routes>
          <Route index element={<Form />} />
          <Route path="/oauth" element={<OAuth />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
