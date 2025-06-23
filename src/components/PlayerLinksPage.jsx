import React, { useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import Navigation from './Navigation';
import { useNavigate, useLocation } from 'react-router-dom';
import LZString from 'lz-string';
import InvitePlayers from './InvitePlayers';
import { toast } from 'react-hot-toast';

const PlayerLinksPage = () => {
  const { state, actions } = useGame();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gameData = params.get('game');
    if (gameData && state.players.length === 0) {
      try {
        const decompressed = LZString.decompressFromBase64(decodeURIComponent(gameData));
        const players = JSON.parse(decompressed);
        if (players && Array.isArray(players)) {
          actions.setPlayers(players);
        }
      } catch (e) {
        console.error("Failed to parse game data from URL", e);
        toast.error("Invalid game link.");
        navigate('/');
      }
    }
  }, [location, actions, navigate, state.players.length]);

  const encodedGameData = useMemo(() => {
    if (state.players.length === 0) return '';
    const json = JSON.stringify(state.players);
    const compressed = LZString.compressToBase64(json);
    return encodeURIComponent(compressed);
  }, [state.players]);

  const handleOpenModeratorView = () => {
    // Generate the full URL for the moderator page
    const moderatorUrl = `${window.location.origin}/moderator?game=${encodedGameData}`;
    window.open(moderatorUrl, '_blank');
  };

  const handleNewGame = () => {
    actions.newGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen text-[#4a3f3c]">
      <Navigation showBackToWelcome={true} />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-4xl mx-auto space-y-8 mt-12">
          
          <InvitePlayers encodedGameData={encodedGameData} />

          {/* Player Links */}
          <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong">
            <h2 className="text-3xl font-semibold mb-6 font-fredoka text-center text-brand-brown-800 drop-shadow-soft">Player Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {state.players.map((player) => {
                const playerUrl = `${window.location.origin}/player/${player.playerId}?game=${encodedGameData}`;
                
                return (
                  <div key={player.playerId} className="bg-[#faf6f2] rounded-lg p-4 border border-[#e0d8d4] shadow-soft flex flex-col justify-between">
                    <h3 className="font-semibold text-lg mb-3 font-fredoka text-brand-brown-800">{player.name}</h3>
                    <div className="flex items-center space-x-3">
                       <a
                        href={playerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-terracotta-600 hover:text-brand-terracotta-700 text-sm break-all font-mono bg-white p-2 rounded border transition-colors flex-grow"
                      >
                        {`/player/${player.playerId.substring(0, 12)}...`}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Game Controls */}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mt-8">
            <button
              onClick={handleOpenModeratorView}
              className="w-full md:w-auto bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-soft hover:shadow-medium font-fredoka tracking-wide"
            >
              Open Moderator View
            </button>
            <button
              onClick={handleNewGame}
              className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-soft hover:shadow-medium font-fredoka tracking-wide"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerLinksPage; 