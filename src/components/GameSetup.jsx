import React, { useState } from 'react';
import Navigation from './Navigation';

const GameSetup = ({ onGameStart }) => {
  const [playerCount, setPlayerCount] = useState(4);
  const [playerNames, setPlayerNames] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('count'); // 'count' or 'names'

  const getWerewolfCount = () => {
    if (playerCount <= 6) return 1;
    if (playerCount <= 10) return 2;
    if (playerCount <= 13) return 3;
    return 4;
  };

  const handleNextPhase = () => {
    if (currentPhase === 'count') {
      setCurrentPhase('names');
      setPlayerNames(new Array(playerCount).fill(''));
    }
  };

  const handleBackPhase = () => {
    if (currentPhase === 'names') {
      setCurrentPhase('count');
      setPlayerNames([]);
    }
  };

  const handleNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    if (playerNames.some(name => name.trim() === '')) {
      alert('Please fill in all player names');
      return;
    }
    // The role assignment and commitment generation will be handled in the GameContext now
    onGameStart(playerNames);
  };

  return (
    <div className="min-h-screen text-[#4a3f3c]">
      <Navigation
        showBackToWelcome={true}
        showBack={currentPhase === 'names'}
        showNext={currentPhase === 'count'}
        onBack={handleBackPhase}
        onNext={handleNextPhase}
        backText="Back to Player Count"
        nextText="Next: Enter Names"
      />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong">
            <h2 className="text-3xl font-semibold mb-8 font-fredoka text-center text-brand-brown-800 drop-shadow-soft">Game Setup</h2>
            {currentPhase === 'count' ? (
              <div className="space-y-8 text-center">
                <div>
                  <label className="block text-lg font-medium mb-4 text-brand-brown-800 font-fredoka">
                    Number of Players
                  </label>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <button
                      onClick={() => setPlayerCount(Math.max(4, playerCount - 1))}
                      className="w-16 h-16 bg-brand-brown-100 hover:bg-brand-brown-200 text-brand-brown-700 font-bold text-3xl rounded-full transition-all duration-200 shadow-soft hover:shadow-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={playerCount <= 4}
                    >
                      -
                    </button>
                    <span className="w-24 text-6xl font-bold font-fredoka text-brand-terracotta-500">
                      {playerCount}
                    </span>
                     <button
                      onClick={() => setPlayerCount(Math.min(15, playerCount + 1))}
                      className="w-16 h-16 bg-brand-brown-100 hover:bg-brand-brown-200 text-brand-brown-700 font-bold text-3xl rounded-full transition-all duration-200 shadow-soft hover:shadow-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={playerCount >= 15}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-md text-brand-brown-700 space-y-2 font-fredoka bg-brand-brown-50 p-6 rounded-lg border border-brand-brown-200 shadow-inner">
                  <p>Players: {playerCount}</p>
                  <p>Werewolves: {getWerewolfCount()}</p>
                  <p>Healer: 1</p>
                  <p>Detective: 1</p>
                  <p>Villagers: {Math.max(0, playerCount - getWerewolfCount() - 2)}</p>
                </div>
                <button
                  onClick={handleNextPhase}
                  className="w-full bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-strong text-xl font-fredoka tracking-wide drop-shadow-soft"
                >
                  Next: Enter Player Names
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-6 text-brand-brown-800 font-fredoka drop-shadow-soft">Enter Player Names</h3>
                {playerNames.map((name, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium mb-3 text-brand-brown-700 font-fredoka">
                      Player {index + 1}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder={`Player ${index + 1} name`}
                      className="w-full px-4 py-3 bg-white border border-[#d7ccc8] rounded-lg focus:ring-2 focus:ring-brand-terracotta-400 focus:border-transparent shadow-soft font-fredoka"
                    />
                  </div>
                ))}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleBackPhase}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-lg transition-all duration-300 font-fredoka tracking-wide shadow-soft hover:shadow-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStartGame}
                    className="flex-1 bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-strong text-xl font-fredoka tracking-wide drop-shadow-soft"
                  >
                    Start Game
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSetup; 