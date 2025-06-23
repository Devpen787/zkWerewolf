import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import { Toaster, toast } from 'react-hot-toast'

import WelcomePage from './components/WelcomePage';
import Navigation from './components/Navigation';
import InvitePlayers from './components/InvitePlayers';
import PlayerLinksPage from './components/PlayerLinksPage';
import { useGame } from './context/GameContext';

// Import role images
import villagerImage from './assets/villager.png';
import werewolfImage from './assets/werewolf.png';
import healerImage from './assets/healer.png';
import detectiveImage from './assets/detective.png';

// Game roles
const ROLES = {
  WEREWOLF: 'werewolf',
  VILLAGER: 'villager',
  HEALER: 'healer',
  DETECTIVE: 'detective'
}

// Game phases
const PHASES = {
  SETUP: 'setup',
  NIGHT: 'night',
  DAY: 'day'
}

// Poseidon-like hash function (simplified for demo)
const poseidonHash = (input) => {
  const salt = 'zkwerewolf_salt_2024'
  const combined = input + salt + Date.now().toString()
  const hash = CryptoJS.SHA256(combined).toString()
  const mixed = CryptoJS.SHA256(hash + salt).toString()
  return mixed.substring(0, 64)
}

// Generate unique player ID
const generatePlayerId = (name) => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  const nameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)
  return `${nameSlug}-${timestamp}${random}`
}

// Role assignment logic based on player count
const assignRoles = (playerCount) => {
  const players = []
  let werewolfCount = 0
  
  // Determine number of werewolves based on player count
  if (playerCount <= 6) {
    werewolfCount = 1
  } else if (playerCount <= 10) {
    werewolfCount = 2
  } else if (playerCount <= 13) {
    werewolfCount = 3
  } else {
    werewolfCount = 4
  }
  
  // Create player array with roles
  for (let i = 0; i < playerCount; i++) {
    let role = ROLES.VILLAGER
    
    if (i < werewolfCount) {
      role = ROLES.WEREWOLF
    } else if (i === werewolfCount) {
      role = ROLES.HEALER
    } else if (i === werewolfCount + 1) {
      role = ROLES.DETECTIVE
    }
    
    players.push({
      id: i,
      name: `Player ${i + 1}`,
      role: role,
      commitment: null,
      playerId: null
    })
  }
  
  // Shuffle the array to randomize role distribution
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[players[i], players[j]] = [players[j], players[i]]
  }
  
  return players
}

// Generate commitments for all players
const generateCommitments = (players) => {
  return players.map(player => ({
    ...player,
    commitment: poseidonHash(`${player.name}:${player.role}:${player.id}`),
    playerId: generatePlayerId(player.name)
  }))
}

// ZK Proof system to verify werewolf presence
const proveWerewolfPresence = (commitments, players) => {
  const werewolves = players.filter(p => p.role === ROLES.WEREWOLF)
  
  if (werewolves.length === 0) {
    return {
      success: false,
      message: 'No werewolves found - cannot generate proof',
      proof: null
    }
  }
  
  // Simulate ZK proof generation
  const proofData = {
    publicInput: {
      totalPlayers: players.length,
      werewolfCount: werewolves.length,
      commitmentRoot: poseidonHash(commitments.join('')),
      timestamp: new Date().toISOString()
    },
    proof: {
      witness: werewolves.map(w => w.commitment),
      challenge: poseidonHash(`challenge:${Date.now()}`),
      response: poseidonHash(`response:${werewolves.length}:${Date.now()}`),
      merkleRoot: poseidonHash(commitments.join(''))
    },
    verification: {
      isValid: true,
      werewolfExists: true,
      timestamp: new Date().toISOString()
    }
  }
  
  return {
    success: true,
    proof: proofData,
    message: `ZK Proof generated successfully! Proves existence of ${werewolves.length} werewolf(ves)`,
    werewolfCount: werewolves.length
  }
}

// Game Setup Component
function GameSetup({ onGameStart }) {
  const [playerCount, setPlayerCount] = useState(4)
  const [players, setPlayers] = useState([])
  const [playerNames, setPlayerNames] = useState([])
  const [currentPhase, setCurrentPhase] = useState('count') // 'count' or 'names'

  const getWerewolfCount = () => {
    if (playerCount <= 6) return 1
    if (playerCount <= 10) return 2
    if (playerCount <= 13) return 3
    return 4
  }

  const handleNextPhase = () => {
    if (currentPhase === 'count') {
      setCurrentPhase('names')
      setPlayerNames(new Array(playerCount).fill(''))
    }
  }

  const handleBackPhase = () => {
    if (currentPhase === 'names') {
      setCurrentPhase('count')
      setPlayerNames([])
    }
  }

  const handleNameChange = (index, name) => {
    const newNames = [...playerNames]
    newNames[index] = name
    setPlayerNames(newNames)
  }

  const handleStartGame = () => {
    if (playerNames.some(name => name.trim() === '')) {
      alert('Please fill in all player names')
      return
    }

    const assignedPlayers = assignRoles(playerCount)
    const playersWithNames = assignedPlayers.map((player, index) => ({
      ...player,
      name: playerNames[index]
    }))
    const playersWithCommitments = generateCommitments(playersWithNames)
    setPlayers(playersWithCommitments)
    onGameStart(playersWithCommitments)
  }

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
  )
}

// Individual Player Page Component
function PlayerPage() {
  const { playerId } = useParams()
  const location = useLocation();
  const { state, actions } = useGame();
  const [player, setPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRole, setShowRole] = useState(false)

  useEffect(() => {
    // This effect's job is to ensure the player list is loaded, either from
    // the context or from the URL. It will trigger a re-render when the
    // players list is ready.
    if (state.players.length === 0) {
      const searchParams = new URLSearchParams(location.search);
      const gameData = searchParams.get('game');
      if (gameData) {
        try {
          const decodedPlayers = JSON.parse(decodeURIComponent(gameData));
          actions.setPlayers(decodedPlayers);
        } catch (e) {
          console.error("Failed to parse game data from URL", e);
          setError("Could not load game data. The link may be corrupted.");
          setIsLoading(false);
        }
      }
    }
  }, [location.search, state.players.length, actions]);

  useEffect(() => {
    // This effect runs whenever the players list changes. Its only job
    // is to find the current player from that list.
    if (state.players.length > 0) {
      const foundPlayer = state.players.find(p => p.playerId === playerId);
      if (foundPlayer) {
        setPlayer(foundPlayer);
      } else {
        setError("Player ID not found in this game session.");
      }
      setIsLoading(false);
    } else {
      // If there are no players after attempting to load, set loading to false.
      // The first effect will handle setting an error if the URL was bad.
      const gameData = new URLSearchParams(location.search).get('game');
      if (!gameData) {
         setError("This player link is invalid or the game session has expired.");
         setIsLoading(false);
      }
    }
  }, [playerId, state.players]);

  useEffect(() => {
    // This effect runs when the player object is successfully found or changed.
    if (player) {
      // Set a timer to automatically hide the role, for example, after 10 seconds
      const timer = setTimeout(() => {
        setShowRole(false);
      }, 10000); // 10 seconds

      // Cleanup function to clear the timer if the component unmounts or player changes
      return () => clearTimeout(timer);
    }
  }, [player]);
  
  const handleToggleRole = () => {
    setShowRole(!showRole)
  }
  
  if (isLoading) {
    return (
       <div className="min-h-screen text-[#4a3f3c] flex items-center justify-center">
        <div className="text-center bg-[#fdfaf6] p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4 font-fredoka">Loading Player...</h1>
          <p className="text-[#6d4c41]">Please wait while we fetch the game data.</p>
        </div>
      </div>
    )
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
    )
  }
  
  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.WEREWOLF: return 'text-red-400'
      case ROLES.HEALER: return 'text-green-400'
      case ROLES.DETECTIVE: return 'text-blue-400'
      case ROLES.VILLAGER: return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }
  
  const getRoleImage = (role) => {
    switch (role) {
      case ROLES.WEREWOLF: return werewolfImage;
      case ROLES.HEALER: return healerImage;
      case ROLES.DETECTIVE: return detectiveImage;
      case ROLES.VILLAGER: return villagerImage;
      default: return null;
    }
  }
  
  const getRoleDescription = (role) => {
    switch (role) {
      case ROLES.WEREWOLF: return 'You are a Werewolf. Work with your team to eliminate villagers without being discovered.'
      case ROLES.HEALER: return 'You are the Healer. Each night, you can save one player from being killed by werewolves.'
      case ROLES.DETECTIVE: return 'You are the Detective. Each night, you can investigate one player to learn their role.'
      case ROLES.VILLAGER: return 'You are a Villager. Work with other villagers to identify and eliminate the werewolves.'
      default: return ''
    }
  }
  
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
              
              <div className="text-xs text-brand-brown-600 mt-8 font-fredoka bg-brand-brown-50 p-4 rounded-lg border border-brand-brown-200">
                <p className="mb-2">Player ID: {player.playerId}</p>
                <p>Share this link with {player.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Moderator View Component
function ModeratorView() {
  const { state, actions } = useGame()
  const { players } = state
  const [currentPhase, setCurrentPhase] = useState(PHASES.NIGHT)
  const [step, setStep] = useState(0) // For multi-step phases
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    let playersList = state.players;
    
    // If players aren't in context, try to load them from the URL or localStorage
    if (playersList.length === 0) {
      const searchParams = new URLSearchParams(location.search);
      const gameData = searchParams.get('game');

      if (gameData) {
        try {
          const decodedPlayers = JSON.parse(decodeURIComponent(gameData));
          actions.setPlayers(decodedPlayers);
          console.log("Loaded players from URL in ModeratorView!", decodedPlayers);
        } catch (e) {
          console.error("Failed to parse game data from URL", e);
        }
      }
    }
     setIsLoading(false);
  }, [state.players, location.search, actions]);

  // Debugging logs
  useEffect(() => {
    console.log("ModeratorView rendered", {
      playersInContext: players.length,
    });
  }, [players]);
  
  const phaseSteps = {
    [PHASES.NIGHT]: [
      "Everyone close your eyes",
      "Werewolves, open your eyes and choose a target",
      "Werewolves, close your eyes",
      "Healer, open your eyes and choose someone to save",
      "Healer, close your eyes",
      "Detective, open your eyes and choose someone to investigate",
      "Detective, close your eyes",
      "Everyone open your eyes"
    ],
    [PHASES.DAY]: [
      "The night has passed",
      "Discuss what happened",
      "Vote on who to eliminate",
      "Announce the elimination"
    ]
  }
  
  const handlePhaseChange = () => {
    if (currentPhase === PHASES.NIGHT) {
      setCurrentPhase(PHASES.DAY)
      setStep(0)
    } else {
      setCurrentPhase(PHASES.NIGHT)
      setStep(0)
    }
  }
  
  const handleNextStep = () => {
    if (step < phaseSteps[currentPhase].length - 1) {
      setStep(step + 1)
    }
  }
  
  const handleGenerateZKProof = () => {
    if (state.zkProof) {
      toast('Proof has already been generated.', { icon: 'ℹ️' });
      return;
    }
    const commitments = players.map(p => p.commitment)
    const result = proveWerewolfPresence(commitments, players)
    if (result.success) {
      actions.setZkProof(result)
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }
  
  if (isLoading) {
    return (
       <div className="min-h-screen text-[#4a3f3c] flex items-center justify-center">
        <div className="text-center bg-[#fdfaf6] p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4 font-fredoka">Loading Moderator View...</h1>
          <p className="text-[#6d4c41]">Please wait while we fetch the game data.</p>
        </div>
      </div>
    )
  }
  
  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.WEREWOLF: return 'text-red-400'
      case ROLES.HEALER: return 'text-green-400'
      case ROLES.DETECTIVE: return 'text-blue-400'
      case ROLES.VILLAGER: return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }
  
  return (
    <div className="min-h-screen text-[#4a3f3c]">
      <Navigation showBackToWelcome={true} />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-4xl font-fredoka font-bold text-white text-shadow-lg text-center mb-8 drop-shadow-soft">
          Moderator View
        </h1>
        
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Game Phase Control */}
          <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-semibold font-fredoka text-brand-brown-800 drop-shadow-soft">Game Phase: {currentPhase.toUpperCase()}</h2>
              <button
                onClick={handlePhaseChange}
                className="bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-fredoka font-bold px-6 py-3 rounded-lg transition-all duration-300 shadow-soft hover:shadow-medium tracking-wide"
              >
                Switch to {currentPhase === PHASES.NIGHT ? 'DAY' : 'NIGHT'}
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
          
          {/* Player List */}
          <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong">
            <h2 className="text-2xl font-semibold mb-6 font-fredoka text-brand-brown-800 drop-shadow-soft">All Players & Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player) => (
                <div key={player.id} className="bg-[#faf6f2] rounded-lg p-6 border border-[#e0d8d4] shadow-soft">
                  <h3 className="font-semibold text-lg font-fredoka text-brand-brown-800 mb-2">{player.name}</h3>
                  <p className={`text-sm font-medium ${getRoleColor(player.role)} font-fredoka mb-3`}>
                    {player.role.charAt(0).toUpperCase() + player.role.slice(1)}
                  </p>
                  <p className="text-xs text-brand-brown-600 mt-3 break-all font-mono bg-white p-2 rounded border">
                    ID: {player.playerId}
                  </p>
                  <p className="text-xs text-brand-brown-600 break-all font-mono bg-white p-2 rounded border mt-2">
                    Commitment: {player.commitment.substring(0, 16)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Invite Players Section */}
          <InvitePlayers />

          {/* ZK Proof Section */}
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
  )
}

// Main App Component with Routing
function App() {
  return (
    <Router>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      {/* MainApp contains the logic to switch pages based on context */}
      <MainApp />
    </Router>
  )
}

function MainApp() {
  const { actions } = useGame()
  const navigate = useNavigate()

  const handleGameStart = (players) => {
    actions.setPlayers(players);
    navigate('/links');
  };

  const handleStartSetup = () => {
    navigate('/setup');
  }

  return (
    <Routes>
      <Route path="/" element={<WelcomePage onStart={handleStartSetup} />} />
      <Route path="/setup" element={<GameSetup onGameStart={handleGameStart} />} />
      <Route path="/links" element={<PlayerLinksPage />} />
      <Route path="/player/:playerId" element={<PlayerPage />} />
      <Route path="/moderator" element={<ModeratorView />} />
    </Routes>
  );
}

export default App 