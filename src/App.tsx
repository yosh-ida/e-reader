import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BookShelfScene from './Scene/BookShelf';
import ViewerScene from './Scene/Viewer';
import SettingsScene from './Scene/Settings';
import NotFoundScene from './Scene/NotFound';

function App() {
  return (
    <BrowserRouter basename={process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : "e-reader/"}>
      {/* <BrowserRouter> */}
      <Routes>
        <Route path="/" element={<BookShelfScene />} />
        <Route path="/settings" element={<SettingsScene />} />
        <Route path="/viewer" element={<ViewerScene />} />
        <Route path="*" element={<NotFoundScene />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
