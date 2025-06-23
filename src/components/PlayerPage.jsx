import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import Navigation from './Navigation';
import LZString from 'lz-string';

// Import role images
import villagerImage from '../assets/villager.png';
import werewolfImage from '../assets/werewolf.png';
import healerImage from '../assets/healer.png';
import detectiveImage from '../assets/detective.png';

const PlayerPage = () => {
  const { playerId } = useParams();
  const location = useLocation();
  const { state, actions } = useGame();
  const [player, setPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRole, setShowRole] = useState(false);

  useEffect(() => {
    if (state.players.length === 0) {
      const searchParams = new URLSearchParams(location.search);
      const gameData = searchParams.get('game');
      if (gameData) {
        try {
          const decompressed = LZString.decompressFromBase64(decodeURIComponent(gameData));
          const decodedPlayers = JSON.parse(decompressed);
          if (decodedPlayers && Array.isArray(decodedPlayers)) {
            actions.setPlayers(decodedPlayers);
          }
        } catch (e) {
          console.error("Failed to parse game data from URL", e);
          setError("Could not load game data. The link may be corrupted.");
          setIsLoading(false);
        }
      }
    }
  }, [location.search, state.players.length, actions]);

  useEffect(() => {
    if (state.players.length > 0) {
      const foundPlayer = state.players.find(p => p.playerId === playerId);
      if (foundPlayer) {
        setPlayer(foundPlayer);
      } else {
        setError("Player ID not found in this game session.");
      }
      setIsLoading(false);
    } else {
      const gameData = new URLSearchParams(location.search).get('game');
      if (!gameData) {
         setError("This player link is invalid or the game session has expired.");
         setIsLoading(false);
      }
    }
  }, [playerId, state.players, location.search]);
  
  const handleToggleRole = () => {
    setShowRole(!showRole);
  };

  if (isLoading) {
    return (
       <div className="min-h-screen text-[#4a3f3c] flex items-center justify-center">
        <div className="text-center bg-[#fdfaf6] p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4 font-fredoka">Loading Player...</h1>
          <p className="text-[#6d4c41]">Please wait while we fetch the game data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-[#4a3f3c] flex items-center justify-center">
        <Navigation showBackToWelcome={true} />
        <div className="text-center bg-[#fdfaf6] p-8 rounded-xl shadow-lg mt-20">
          <h1 className="text-2xl font-bold mb-4 font-fredoka">Player Not Found</h1>
          <p className="text-[#6d4c41]">{error}</p>
        </div>
      </div>
    );
  }
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'werewolf': return 'text-red-400';
      case 'healer': return 'text-green-400';
      case 'detective': return 'text-blue-400';
      case 'villager': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };
  
  const getRoleImage = (role) => {
    switch (role) {
      case 'werewolf': return werewolfImage;
      case 'healer': return healerImage;
      case 'detective': return detectiveImage;
      case 'villager': return villagerImage;
      default: return null;
    }
  };
  
  const getRoleDescription = (role) => {
    switch (role) {
      case 'werewolf': return 'You are a Werewolf. Work with your team to eliminate villagers without being discovered.';
      case 'healer': return 'You are the Healer. Each night, you can save one player from being killed by werewolves.';
      case 'detective': return 'You are the Detective. Each night, you can investigate one player to learn their role.';
      case 'villager': return 'You are a Villager. Work with other villagers to identify and eliminate the werewolves.';
      default: return '';
    }
  };
  
  return (
    <div className="min-h-screen text-[#4a3f3c]">
      <Navigation showBackToWelcome={true} />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-md mx-auto">
          <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong text-center">
            <h1 className="text-3xl font-bold mb-6 font-fredoka text-brand-brown-800 drop-shadow-soft">
              {player.name}
            </h1>
            <div className="space-y-6">
              {showRole ? (
                <div className="space-y-6">
                  <div className="bg-[#faf6f2] rounded-lg p-6 border border-[#e0d8d4] shadow-soft">
                    <h2 className={`text-xl font-bold mb-4 font-fredoka ${getRoleColor(player.role)} drop-shadow-soft`}>
                      {player.role.charAt(0).toUpperCase() + player.role.slice(1)}
                    </h2>
                    <img 
                      src={getRoleImage(player.role)} 
                      alt={player.role}
                      className="w-48 h-48 mx-auto rounded-lg my-4 shadow-medium"
                    />
                    <p className="text-sm text-brand-brown-700 font-fredoka leading-relaxed">
                      {getRoleDescription(player.role)}
                    </p>
                  </div>
                  <div className="bg-[#faf6f2] rounded-lg p-4 border border-[#e0d8d4] shadow-soft">
                    <h3 className="text-sm font-medium text-brand-brown-700 mb-3 font-fredoka">Role Commitment</h3>
                    <p className="text-xs text-brand-brown-600 break-all font-mono bg-white p-2 rounded border">
                      {player.commitment}
                    </p>
                  </div>
                  <button
                    onClick={handleToggleRole}
                    className="w-full bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 font-fredoka tracking-wide shadow-soft hover:shadow-medium"
                  >
                    Hide Role
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#faf6f2] rounded-lg p-6 border border-[#e0d8d4] shadow-soft">
                    <h2 className="text-xl font-bold mb-4 text-gray-500 font-fredoka drop-shadow-soft">
                      Role Hidden
                    </h2>
                    <p className="text-sm text-brand-brown-700 font-fredoka leading-relaxed">
                      Your role is currently hidden. Click below to reveal it again.
                    </p>
                  </div>
                  <button
                    onClick={handleToggleRole}
                    className="w-full bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 font-fredoka tracking-wide shadow-soft hover:shadow-medium"
                  >
                    Show Role
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage; 