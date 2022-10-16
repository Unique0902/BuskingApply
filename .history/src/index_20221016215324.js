import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import AuthService from './service/auth_service';
import PlaylistRepository from './service/playlist_repository';
import UserRepository from './service/userRepository';
import BuskingRepository from './service/buskingRepository';
import IpService from './service/ipService';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const authService = new AuthService();
const userRepository = new UserRepository();
const playlistRepository = new PlaylistRepository();
const buskingRepository = new BuskingRepository();
const ipService = new IpService();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='apply'>
          <Route
            path=':userId'
            element={
              <App
                buskingRepository={buskingRepository}
                userRepository={userRepository}
                playlistRepository={playlistRepository}
                ipService={ipService}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
