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
          <OfflineBanner />
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

// Displays a fixed banner if the user is offline
function OfflineBanner() {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-200 text-yellow-900 text-center py-2 font-semibold shadow-md">
      <span className="mr-2">⚠️</span>
      You are offline. Some features may not work until you reconnect.
    </div>
  );
}

export default App;