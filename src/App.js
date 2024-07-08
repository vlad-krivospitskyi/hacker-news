import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NewsPage from './app/components/NewsPage';
import NewsItemDetail from './app/components/NewsItemDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsItemDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
