import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { assignRoles } from './utils/gameUtils';

import WelcomePage from './components/WelcomePage';
import GameSetup from './components/GameSetup';
import PlayerLinksPage from './components/PlayerLinksPage';
import PlayerPage from './components/PlayerPage';
import ModeratorView from './components/ModeratorView';
import ZKVerificationPage from './components/ZKVerificationPage';

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

function MainApp() {
  const { actions } = useGame();
  const navigate = useNavigate();

  const handleGameStart = (playerNames) => {
    // Create basic player objects
    const basicPlayers = playerNames.map((name) => ({
      playerId: crypto.randomUUID(),
      name: name.trim(),
      role: null,
      secret: null,
      commitment: null,
    }));
    
    // Assign roles to players
    const playersWithRoles = assignRoles(basicPlayers);
    
    actions.setPlayers(playersWithRoles);
    navigate('/player-links');
  };

  const handleStartSetup = () => {
    navigate('/setup');
  };

  return (
    <Routes>
      <Route path="/" element={<WelcomePage onStart={handleStartSetup} />} />
      <Route path="/setup" element={<GameSetup onGameStart={handleGameStart} />} />
      <Route path="/player-links" element={<PlayerLinksPage />} />
      <Route path="/player/:playerId" element={<PlayerPage />} />
      <Route path="/moderator" element={<ModeratorView />} />
      <Route path="/zk-verification" element={<ZKVerificationPage />} />
    </Routes>
  );
}

export default App;