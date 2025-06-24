import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import Navigation from './Navigation';
import { toast } from 'react-hot-toast';
import LZString from 'lz-string';

const ModeratorView = () => {
  const { state, actions } = useGame();
  const { players, eliminatedPlayers = [] } = state;
  const [currentPhase, setCurrentPhase] = useState('night');
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

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
          setError('Could not load game data. The link may be corrupted or expired.');
        }
      } else {
        setError('No game data found in the link.');
      }
    }
    setIsLoading(false);
  }, [state.players, location.search, actions]);

  const phaseSteps = {
    night: [
      "Everyone close your eyes",
      "Werewolves, open your eyes and choose a target",
      "Werewolves, close your eyes",
      "Healer, open your eyes and choose someone to save",
      "Healer, close your eyes",
      "Detective, open your eyes and choose someone to investigate",
      "Detective, close your eyes",
      "Everyone open your eyes"
    ],
    day: [
      "The night has passed",
      "Discuss what happened",
      "Vote on who to eliminate",
      "Announce the elimination"
    ]
  };
  
  const handlePhaseChange = () => {
    setCurrentPhase(currentPhase === 'night' ? 'day' : 'night');
    setStep(0);
  };
  
  const handleNextStep = () => {
    if (step < phaseSteps[currentPhase].length - 1) {
      setStep(step + 1);
    }
  };
  
  const handleGenerateZKProof = () => {
    if (state.zkProof) {
      toast('Proof has already been generated.', { icon: 'ℹ️' });
      return;
    }
    const mockProof = {
      message: 'ZK Proof generated successfully',
      proof: {
        publicInput: {
          commitmentRoot: '0x1234567890abcdef...'
        }
      }
    };
    actions.setZkProof(mockProof);
    toast('ZK Proof generated!', { icon: '✅' });
  };
  
  const handleToggleElimination = (playerId, playerName) => {
    const isEliminated = eliminatedPlayers.includes(playerId);
    actions.togglePlayerElimination(playerId);
    if (isEliminated) {
      toast.success(`${playerName} has been revived!`, { icon: '✨' });
    } else {
      toast.success(`${playerName} has been eliminated!`, { icon: '💀' });
    }
  };
  
  if (isLoading) {
    return (
       <div className="min-h-screen text-[#4a3f3c] flex items-center justify-center">
        <div className="text-center bg-[#fdfaf6] p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4 font-fredoka">Loading Moderator View...</h1>
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
          <h1 className="text-2xl font-bold mb-4 font-fredoka">Game Data Error</h1>
          <p className="text-[#6d4c41]">{error}</p>
        </div>
      </div>
    );
  }
  
  const getRoleColor = (role) => {
    if (!role) return 'text-gray-400';
    switch (role) {
      case 'werewolf': return 'text-red-400';
      case 'healer': return 'text-green-400';
      case 'detective': return 'text-blue-400';
      case 'villager': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };
  
  // Calculate game statistics
  const alivePlayers = players.filter(player => !eliminatedPlayers.includes(player.playerId));
  const eliminatedCount = eliminatedPlayers.length;
  const aliveCount = alivePlayers.length;
  
  return (
    <div className="min-h-screen text-[#4a3f3c]">
      <Navigation showBackToWelcome={true} />
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-4xl font-fredoka font-bold text-white text-shadow-lg text-center mb-8 drop-shadow-soft">
          Moderator View
        </h1>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-semibold font-fredoka text-brand-brown-800 drop-shadow-soft">Game Phase: {currentPhase.toUpperCase()}</h2>
              <button
                onClick={handlePhaseChange}
                className="bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-fredoka font-bold px-6 py-3 rounded-lg transition-all duration-300 shadow-soft hover:shadow-medium tracking-wide"
              >
                Switch to {currentPhase === 'night' ? 'DAY' : 'NIGHT'}
              </button>
            </div>
            <div className="bg-[#faf6f2] rounded-lg p-6 mb-6 border border-[#e0d8d4] shadow-soft">
              <h3 className="text-lg font-medium mb-4 font-fredoka text-brand-brown-700">Current Step:</h3>
              <p className="text-brand-brown-700 mb-6 font-fredoka leading-relaxed">{phaseSteps[currentPhase][step]}</p>
              <button
                onClick={handleNextStep}
                disabled={step >= phaseSteps[currentPhase].length - 1}
                className="bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-fredoka font-bold px-6 py-3 rounded-lg transition-all duration-300 shadow-soft hover:shadow-medium tracking-wide"
              >
                Next Step
              </button>
            </div>
          </div>
          <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong">
            <h2 className="text-2xl font-semibold mb-6 font-fredoka text-brand-brown-800 drop-shadow-soft">Game Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#faf6f2] rounded-lg p-4 border border-[#e0d8d4] shadow-soft text-center">
                <div className="text-2xl font-bold text-green-600 font-fredoka">{aliveCount}</div>
                <div className="text-sm text-brand-brown-700 font-fredoka">Alive</div>
              </div>
              <div className="bg-[#faf6f2] rounded-lg p-4 border border-[#e0d8d4] shadow-soft text-center">
                <div className="text-2xl font-bold text-red-600 font-fredoka">{eliminatedCount}</div>
                <div className="text-sm text-brand-brown-700 font-fredoka">Eliminated</div>
              </div>
            </div>
          </div>
          <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong">
            <h2 className="text-2xl font-semibold mb-6 font-fredoka text-brand-brown-800 drop-shadow-soft">All Players & Roles</h2>
            <p className="text-sm text-brand-brown-600 mb-4 font-fredoka">Click on a player card to toggle elimination status</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player) => {
                const isEliminated = eliminatedPlayers.includes(player.playerId);
                return (
                  <div 
                    key={player.playerId} 
                    className={`bg-[#faf6f2] rounded-lg p-6 border border-[#e0d8d4] shadow-soft cursor-pointer transition-all duration-300 hover:shadow-medium ${
                      isEliminated ? 'opacity-50 bg-gray-100' : ''
                    }`}
                    onClick={() => handleToggleElimination(player.playerId, player.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold text-lg font-fredoka text-brand-brown-800 ${isEliminated ? 'line-through' : ''}`}>{player.name}</h3>
                      {isEliminated && (
                        <span className="text-red-500 text-sm font-bold">💀</span>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${getRoleColor(player.role)} font-fredoka mb-3 ${isEliminated ? 'line-through' : ''}`}>
                      {player.role ? player.role.charAt(0).toUpperCase() + player.role.slice(1) : 'No Role Assigned'}
                    </p>
                    <p className="text-xs text-brand-brown-600 mt-3 break-all font-mono bg-white p-2 rounded border">
                      ID: {player.playerId}
                    </p>
                    <p className="text-xs text-brand-brown-600 break-all font-mono bg-white p-2 rounded border mt-2">
                      Commitment: {player.commitment ? player.commitment.substring(0, 16) + '...' : 'No Commitment'}
                    </p>
                    <div className="mt-3 text-xs text-brand-brown-500 font-fredoka">
                      {isEliminated ? 'Click to revive' : 'Click to eliminate'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong">
            <h2 className="text-2xl font-semibold mb-6 font-fredoka text-brand-brown-800 drop-shadow-soft">Zero-Knowledge Proof</h2>
            <div className="bg-[#faf6f2] rounded-lg p-6 border border-[#e0d8d4] shadow-soft">
               <h3 className="text-xl font-bold mb-4 font-fredoka text-brand-brown-700">ZK Proof of Werewolves</h3>
               <button
                onClick={handleGenerateZKProof}
                disabled={state.zkProof}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-fredoka font-bold px-6 py-3 rounded-lg transition-all duration-300 shadow-soft hover:shadow-medium tracking-wide"
              >
                {state.zkProof ? 'Proof Generated!' : 'Generate ZK Proof'}
              </button>
              {state.zkProof && (
                <div className="mt-4 text-xs text-green-800 bg-green-50 p-3 rounded-md border border-green-200">
                  <p className="font-bold">{state.zkProof.message}</p>
                  <p className="break-all mt-2 font-mono">Root: {state.zkProof.proof.publicInput.commitmentRoot}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorView; 