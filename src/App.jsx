import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { Toaster } from 'react-hot-toast';

import WelcomePage from './components/WelcomePage';
import GameSetup from './components/GameSetup';
import PlayerLinksPage from './components/PlayerLinksPage';
import PlayerPage from './components/PlayerPage';
import ModeratorView from './components/ModeratorView';

function App() {
  return (
    <GameProvider>
      <Router>
        <Toaster 
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <MainApp />
      </Router>
    </GameProvider>
  );
}

function MainApp() {
  const { actions } = useGame();
  const navigate = useNavigate();

  const handleGameStart = (playerNames) => {
    const newPlayers = playerNames.map((name) => ({
      playerId: crypto.randomUUID(),
      name: name.trim(),
      role: null,
      secret: null,
      commitment: null,
    }));
    actions.setPlayers(newPlayers);
    navigate('/invite');
  };

  const handleStartSetup = () => {
    navigate('/setup');
  };

  return (
    <Routes>
      <Route path="/" element={<WelcomePage onStart={handleStartSetup} />} />
      <Route path="/setup" element={<GameSetup onGameStart={handleGameStart} />} />
      <Route path="/invite" element={<PlayerLinksPage />} />
      <Route path="/player/:playerId" element={<PlayerPage />} />
      <Route path="/moderator" element={<ModeratorView />} />
    </Routes>
  );
}

export default App;