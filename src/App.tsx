import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BookShelfScene from './Scene/BookShelf';
import ViewerScene from './Scene/Viewer';
import SettingsScene from './Scene/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookShelfScene />} />
        <Route path="/settings" element={<SettingsScene />} />
        <Route path="/viewer" element={<ViewerScene />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
